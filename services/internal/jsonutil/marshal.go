package jsonutil

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func MarshalResponse(w http.ResponseWriter, status int, response interface{}) {
	w.Header().Set("Content-Type", "application/json")

	data, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		msg := escapeJSON(err.Error())
		fmt.Fprintf(w, jsonErrTmpl, msg)
		return
	}

	w.WriteHeader(status)
	fmt.Fprintf(w, "%s", data)
}

func escapeJSON(s string) string {
	return strings.Replace(s, `"`, `\"`, -1)
}

const jsonErrTmpl = `{"error":"%s"}`
