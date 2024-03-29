/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/a/handler/localization"

	"github.com/mgenware/goutil/httpx"
)

// JSONResponse helps you create a HTTP response in JSON.
type JSONResponse struct {
	BaseResponse

	writer      http.ResponseWriter
	lsMgr       localization.CoreManager
	params      map[string]any
	isCompleted bool
}

// JSON is a dummy type returned by HTTPResponse to make sure response is completed.
type JSON = int

// NewJSONResponse creates a new JSONResponse.
func NewJSONResponse(w http.ResponseWriter, r *http.Request, lsMgr localization.CoreManager) JSONResponse {
	ctx := r.Context()
	return JSONResponse{
		BaseResponse: newBaseResponse(r),
		params:       appcm.ContextDict(ctx),
		writer:       w,
		lsMgr:        lsMgr,
	}
}

// MustFailWithError finishes the response with the specified code and error, and panics if unexpected error happens.
func (j *JSONResponse) MustFailWithCodeAndError(code int, err error) JSON {
	d := APIResult{Code: code, Error: err}
	if err != nil {
		d.Msg = err.Error()
	}
	j.mustWriteData(&d)
	return JSON(0)
}

// MustFailWithMsg finishes the response with the specified message, and panics if unexpected error happens.
func (j *JSONResponse) MustFail(msg string) JSON {
	j.MustFailWithCodeAndError(int(appDef.ErrGeneric), errors.New(msg))
	return JSON(0)
}

// MustComplete finishes the response with the given data, and panics if unexpected error happens.
func (j *JSONResponse) MustComplete(data any) JSON {
	d := APIResult{Data: data}
	j.mustWriteData(&d)
	return JSON(0)
}

// LS returns the dictionary associated with current language ID.
func (j *JSONResponse) LS() *localization.Dictionary {
	return j.lsMgr.Dictionary(j.Lang())
}

func (j *JSONResponse) Params() map[string]any {
	return j.params
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
	_, err = j.writer.Write(bytes)
	if err != nil {
		panic(err)
	}
}
