/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"qing/a/def/appdef"

	"github.com/mgenware/goutil/httpx"
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
func NewJSONResponse(r *http.Request, wr http.ResponseWriter) *JSONResponse {
	return &JSONResponse{
		BaseResponse: newBaseResponse(r),
		writer:       wr,
	}
}

// MustFailWithError finishes the response with the specified `code`, `error` and `expected` args, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithError(code int, err error, expected bool) JSON {
	d := APIResult{Code: code, Error: err}
	if err != nil {
		// Hide SQL row not found errors.
		if err == sql.ErrNoRows && code == int(appdef.ErrGeneric) {
			d.Msg = "Resource not found"
			d.Code = appdef.ErrResourceNotFound
		} else {
			d.Msg = err.Error()
		}
	}
	j.mustWriteData(&d)
	return JSON(0)
}

// MustFail finishes the response with the specified error object, and panics if unexpected error happens.
func (j *JSONResponse) MustFail(err error) JSON {
	j.MustFailWithError(int(appdef.ErrGeneric), err, false)
	return JSON(0)
}

// MustFailWithUserError finishes the response with an user error (expected error) message, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithUserError(msg string) JSON {
	j.MustFailWithError(int(appdef.ErrGeneric), errors.New(msg), true)
	return JSON(0)
}

// MustFailWithCode finishes the response with the specified error code, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithCode(code int) JSON {
	j.MustFailWithError(code, nil, false)
	return JSON(0)
}

// MustComplete finishes the response with the given data, and panics if unexpected error happens.
func (j *JSONResponse) MustComplete(data any) JSON {
	d := APIResult{Data: data}
	j.mustWriteData(&d)
	return JSON(0)
}

func (j *JSONResponse) mustWriteData(d *APIResult) {
	if j.isCompleted {
		panic(errors.New("response has been written"))
	}
	j.isCompleted = true

	bytes, err := json.Marshal(d)
	if err != nil {
		panic(err)
	}
	httpx.SetResponseContentType(j.writer, httpx.MIMETypeJSONUTF8)
	j.writer.Write(bytes)
}
