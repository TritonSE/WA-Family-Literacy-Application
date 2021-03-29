package middleware

import (
	"encoding/json"
	"net/http"
)

// Sends data and status code for http
func writeResponse(rw http.ResponseWriter, statusCode int, body interface{}) {
	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(statusCode)
	json.NewEncoder(rw).Encode(body)
}
