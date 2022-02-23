/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"errors"
	"net/http"

	"qing/a/appHandler"
	"qing/a/handler"
)

type APISuccessResult struct {
	String string
	One    int
	Zero   int
}

func apiSuccResult(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	res := APISuccessResult{String: "str", One: 1}
	return resp.MustComplete(res)
}

func apiErrorResult(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	return resp.MustFailWithError(1, errors.New("API error for testing"), false)
}

func apiPanicErrorResult(w http.ResponseWriter, r *http.Request) handler.JSON {
	panic(errors.New("API panic error for testing"))
}
