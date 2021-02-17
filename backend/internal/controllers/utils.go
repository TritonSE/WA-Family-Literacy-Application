package controllers

import (
	"encoding/json"
	"net/http"
)

// Sends data and status code for http
func writeResponse(rw http.ResponseWriter, statusCode int, body interface{}) {
	rw.WriteHeader(statusCode)
	rw.Header().Set("Content-Type", "application/json")
	json.NewEncoder(rw).Encode(body)
}
