package testutils

import (
	"encoding/json"
	"github.com/stretchr/testify/require"
	"io/ioutil"
	"net/http"
	"testing"
)

// Sends http request, converts data from json, and stores to response
func SendHttpRequest(req *http.Request, response interface{}, t *testing.T) {

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	require.NoError(t, err)

	err = json.Unmarshal(body, response)
	require.NoError(t, err)
}
