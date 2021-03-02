package testutils

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
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

	body, err := ioutil.ReadAll(res.Body)
	require.NoError(t, err)

	err = json.Unmarshal(body, response)
	require.NoError(t, err)

	// err = json.NewDecoder(res.Body).Decode(response)
	// require.NoError(t, err)
}
