package testutils

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// Sends http request, converts data from json, and stores to response
func MakeHttpRequest(method string, url string, bodyString string, expectedStatusCode int, response interface{}, t *testing.T) {

	bodyReader := strings.NewReader(bodyString)

	req, err := http.NewRequest(method, url, bodyReader)
	require.NoError(t, err)

	if method == "POST" || method == "PUT" {
		req.Header.Set("Content-Type", "application/json")
	}

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	require.Equal(t, expectedStatusCode, res.StatusCode)

	defer res.Body.Close()
	require.Equal(t, expectedStatusCode, res.StatusCode)

	if response != nil {
		err = json.NewDecoder(res.Body).Decode(response)
		require.NoError(t, err)
	}
}

func MakeAuthenticatedRequest(method string, url string, bodyString string, expectedStatusCode int, response interface{}, token string, t *testing.T) {
	bodyReader := strings.NewReader(bodyString)

	req, err := http.NewRequest(method, url, bodyReader)
	require.NoError(t, err)
	req.Header.Add("Authorization", "Bearer "+token)

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	defer res.Body.Close()

	require.Equal(t, expectedStatusCode, res.StatusCode)

	if response != nil {
		err = json.NewDecoder(res.Body).Decode(response)
		require.NoError(t, err)
	}
}
