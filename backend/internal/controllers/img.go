package controllers

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"io/ioutil"
	"net/http"

	_ "image/jpeg"
	_ "image/png"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/utils"
	"github.com/buckket/go-blurhash"

	"github.com/go-chi/chi"
)

type ImgController struct {
	Image database.ImgDatabase
}

var allowedTypes = map[string]struct{}{
	"image/png":  {},
	"image/jpeg": {},
}

// gets an image from the database (/image/{id})
func (c *ImgController) GetImage(rw http.ResponseWriter, req *http.Request) {
	var id string = chi.URLParam(req, "id")
	b64, _ := base64.URLEncoding.DecodeString(id)
	id = string(b64)

	img, ctype, err := c.Image.GetImage(req.Context(), id)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if img == nil {
		writeResponse(rw, http.StatusNotFound, "Image with requested id not found")
		return
	}

	rw.Header().Set("Content-Type", ctype)
	rw.Write(*img)

}

// posts an image to the database and returns the url at which it can be found (/image)
func (c *ImgController) PostImage(rw http.ResponseWriter, req *http.Request) {
	var content_type string = req.Header.Get("Content-Type")

	var baseURL string = utils.GetEnv("BASE_URL", "http://localhost:8080")

	if _, found := allowedTypes[content_type]; !found {
		writeResponse(rw, http.StatusBadRequest, "Invalid image file type")
		return
	}

	body, err := ioutil.ReadAll(req.Body)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	var size float64 = float64(len(body))

	// convert size to mb and check if less than 5 mb
	size = size / (1024 * 1024)
	if size > 5 {
		writeResponse(rw, http.StatusBadRequest, "Image is too large.")
	}

	// get the image into jpg/png form
	img, _, err := image.Decode(bytes.NewReader(body))

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	// encode using blurhash
	hash, err := blurhash.Encode(4, 4, img)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	// check if image already exists
	storedImage, _, err := c.Image.GetImage(req.Context(), hash)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if storedImage != nil {
		// ensure hash is clean for urls
		hash = base64.URLEncoding.EncodeToString([]byte(hash))
		returnUrl := baseURL + "/images/" + hash
		writeResponse(rw, http.StatusOK, returnUrl)
		return
	}

	err = c.Image.InsertImage(req.Context(), body, hash, content_type)

	if err != nil {
		fmt.Print(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	hash = base64.URLEncoding.EncodeToString([]byte(hash))
	returnUrl := baseURL + "/images/" + hash

	writeResponse(rw, http.StatusCreated, returnUrl)

}
