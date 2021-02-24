package testutils

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"
)

// Sends http request, converts data from json, and stores to response
func MakeHttpRequest(method string, url string, response interface{}, t *testing.T) {

	req, err := http.NewRequest(method, url, nil)
	require.NoError(t, err)

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	defer res.Body.Close()

	err = json.NewDecoder(res.Body).Decode(response)
	require.NoError(t, err)
}
