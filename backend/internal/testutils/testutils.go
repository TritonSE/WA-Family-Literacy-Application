package testutils

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"
)

// Sends http request, converts data from json, and stores to response
func MakeHttpRequest(method string, url string, reqBody []byte, response interface{}, t *testing.T) {

	req, err := http.NewRequest(method, url, bytes.NewBuffer(reqBody))
	require.NoError(t, err)

	if method == "POST" || method == "PUT" {
		req.Header.Set("Content-Type", "application/json")
	}

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	defer res.Body.Close()

	err = json.NewDecoder(res.Body).Decode(response)
	if err == io.EOF {
		response = nil
	} else {
		require.NoError(t, err)
	}
}

func MakeJSONBody(body interface{}, t *testing.T) []byte {
	reqJSON, err := json.Marshal(body)
	require.NoError(t, err)
	return []byte(reqJSON)
}
