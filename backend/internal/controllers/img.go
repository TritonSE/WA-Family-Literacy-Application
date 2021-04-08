package controllers

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/TritonSE/words-alive/internal/database"
)

type ImgController struct {
	Image database.ImgDatabase
}

func (c *ImgController) PostImage(rw http.ResponseWriter, req *http.Request) {
	content_type := req.Header.Get("Content-Type")
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