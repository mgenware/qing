package template

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/mgenware/go-packagex/httpx"
	"qing/app/defs"
)

// JSONResponse helps you create a HTTP response in JSON.
type JSONResponse struct {
	BaseResponse

	writer      http.ResponseWriter
	devMode     bool
	isCompleted bool
}

// NewJSONResponse creates a new JSONResponse.
func NewJSONResponse(ctx context.Context, mgr *Manager, wr http.ResponseWriter, devMode bool) *JSONResponse {
	return &JSONResponse{
		BaseResponse: newBaseResponse(ctx, mgr),
		writer:       wr,
		devMode:      devMode,
	}
}

// MustFailWithCodeAndError finishes the response with the specified code and error object, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithCodeAndError(code uint, err error) {
	if j.devMode {
		fmt.Println("🙉 This message only appears in dev mode.")
		if err != nil {
			panic(err)
		} else if code != 0 {
			panic(code)
		}
	}
	d := &APIResult{Code: code, Error: err, Message: err.Error()}
	j.mustWriteData(d)
}

// MustFail finishes the response with the specified error object, and panics if unexpected error happens.
func (j *JSONResponse) MustFail(err error) {
	j.MustFailWithCodeAndError(defs.APIGenericError, err)
}

// MustFailWithMessage finishes the response with the given message, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithMessage(msg string) {
	j.MustFail(errors.New(msg))
}

// MustFailWithCode finishes the response with the specified error code, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithCode(code uint) {
	j.MustFailWithCodeAndError(code, fmt.Errorf("Error code: %v", code))
}

// MustComplete finishes the response with the given data, and panics if unexpected error happens.
func (j *JSONResponse) MustComplete(data interface{}) {
	d := &APIResult{Data: data}
	j.mustWriteData(d)
}

func (j *JSONResponse) mustWriteData(d *APIResult) {
	if j.isCompleted {
		panic("Result has completed")
	}
	j.isCompleted = true

	bytes, err := json.Marshal(d)
	if err != nil {
		panic(err)
	}
	httpx.SetResponseContentType(j.writer, httpx.MIMETypeJSONUTF8)
	j.writer.Write(bytes)
}
