package controllers

import (
	"fmt"
	"io/ioutil"
	"net/http"

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

	img, ctype, err := c.Image.GetImage(req.Context(), id)

	if err != nil {
		fmt.Print("ERROR ON GET")
		return
	}

	rw.Header().Add("Content-Type", *ctype)

	writeResponse(rw, http.StatusCreated, img)

}

func (c *ImgController) PostImage(rw http.ResponseWriter, req *http.Request) {
	content_type := req.Header.Get("Content-Type")

	allowed := allowedTypes[content_type]

	if !allowed {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	body, err := ioutil.ReadAll(req.Body)

	if err != nil {
		fmt.Print("ERROR ON POST")
		return
	}

	url, err := c.Image.InsertImage(req.Context(), body, content_type)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusCreated, url)

}
