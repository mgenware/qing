package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"qing/app/errs"

	"github.com/mgenware/go-packagex/v5/httpx"
)

// JSONResponse helps you create a HTTP response in JSON.
type JSONResponse struct {
	BaseResponse

	writer      http.ResponseWriter
	isCompleted bool
}

// JSON is a dummy type returned by HTTPResponse to make sure response is completed.
type JSON = int

// NewJSONResponse creates a new JSONResponse.
func NewJSONResponse(r *http.Request, mgr *Manager, wr http.ResponseWriter) *JSONResponse {
	return &JSONResponse{
		BaseResponse: newBaseResponse(r, mgr),
		writer:       wr,
	}
}

// MustFailWithError finishes the response with the specified `code`, `error` and `expected` args, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithError(code int, err error, expected bool) JSON {
	d := &APIResult{Code: code, Error: err, Message: err.Error()}
	j.mustWriteData(d)
}

// MustFail finishes the response with the specified error object, and panics if unexpected error happens.
func (j *JSONResponse) MustFail(err error) JSON {
	j.MustFailWithError(errs.Generic, err, false)
}

// MustFailWithUserError finishes the response with an user error (expected error) message, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithUserError(msg string) JSON {
	j.MustFailWithError(errs.Generic, errors.New(msg), true)
}

// MustFailWithCode finishes the response with the specified error code, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithCode(code int) JSON {
	j.MustFailWithError(code, fmt.Errorf("Error code: %v", code), false)
}

// MustComplete finishes the response with the given data, and panics if unexpected error happens.
func (j *JSONResponse) MustComplete(data interface{}) JSON {
	d := &APIResult{Data: data}
	j.mustWriteData(d)
}

func (j *JSONResponse) mustWriteData(d *APIResult) {
	if j.isCompleted {
		panic(errors.New("Result has completed"))
	}
	j.isCompleted = true

	bytes, err := json.Marshal(d)
	if err != nil {
		panic(err)
	}
	httpx.SetResponseContentType(j.writer, httpx.MIMETypeJSONUTF8)
	j.writer.Write(bytes)
}
