package controllers

import (
	"bytes"
	"image"
	"io/ioutil"
	"net/http"
	"net/url"

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

var allowedTypes = map[string]bool{
	"image/png":  true,
	"image/jpeg": true,
}

// gets an image from the database (/image/{id})
func (c *ImgController) GetImage(rw http.ResponseWriter, req *http.Request) {
	var id string = chi.URLParam(req, "id")

	id, _ = url.QueryUnescape(id)

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

	var allowed bool = allowedTypes[content_type]

	if !allowed {
		writeResponse(rw, http.StatusBadRequest, "Invalid image file type")
		return
	}

	body, err := ioutil.ReadAll(req.Body)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
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
		hash = url.QueryEscape(hash)
		returnUrl := baseURL + "/image/" + hash
		writeResponse(rw, http.StatusFound, returnUrl)
		return
	}

	err = c.Image.InsertImage(req.Context(), body, hash, content_type)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	// code to make return url written twice as to not pass queryescaped hash to InsertImage
	hash = url.QueryEscape(hash)
	returnUrl := baseURL + "/image/" + hash

	writeResponse(rw, http.StatusCreated, returnUrl)

}
