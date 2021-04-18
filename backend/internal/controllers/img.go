package controllers

import (
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/TritonSE/words-alive/internal/database"

	"github.com/go-chi/chi"
)

type ImgController struct {
	Image database.ImgDatabase
}

var allowedTypes = map[string]bool{
	"image/png":  true,
	"image/jpeg": true,
}

func (c *ImgController) GetImage(rw http.ResponseWriter, req *http.Request) {
	var id string = chi.URLParam(req, "id")

	id, err := url.PathUnescape(id)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	img, ctype, err := c.Image.GetImage(req.Context(), id)

	if err != nil {
		writeResponse(rw, http.StatusNotFound, "Image with requested id not found")
		return
	}

	rw.Header().Set("Content-Type", *ctype)
	rw.Write(*img)

}

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

	id, err := c.Image.InsertImage(req.Context(), body, content_type)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	url := "/image/" + url.PathEscape(*id)

	writeResponse(rw, http.StatusCreated, url)

}
