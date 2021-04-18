package controllers

import (
	"io/ioutil"
	"net/http"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/utils"

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

	img, ctype, err := c.Image.GetImage(req.Context(), id)

	if err != nil {
		writeResponse(rw, http.StatusNotFound, "Image with requested id not found")
		return
	}

	rw.Header().Set("Content-Type", *ctype)
	rw.Write(*img)

}

// posts an image to the database and returns the url at which it can be found (/image)
func (c *ImgController) PostImage(rw http.ResponseWriter, req *http.Request) {
	var content_type string = req.Header.Get("Content-Type")

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

	id, inserted, err := c.Image.InsertImage(req.Context(), body, content_type)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	baseURL := utils.GetEnv("BASE_URL", "http://localhost:8080")

	url := baseURL + "/image/" + *id

	if !inserted {
		writeResponse(rw, http.StatusFound, url)
		return
	}

	writeResponse(rw, http.StatusCreated, url)

}
