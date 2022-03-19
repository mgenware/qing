/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package sys

import (
	"errors"
	"fmt"
	"net/http"

	"qing/a/app"
	"qing/a/appHandler"
	"qing/a/def/appdef"
)

// PanicMiddleware handles panics.
func PanicMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer recoverFromPanic(w, r)
		next.ServeHTTP(w, r)
	})
}

func recoverFromPanic(w http.ResponseWriter, r *http.Request) {
	info := recover()
	if info == nil {
		return
	}
	// We consider `error` object as unexpected error, non-`error` object as expected error, e.g.
	//     // Throwing an unexpected error
	//     err := doSomething()
	//		 if err != nil {
	//		   panic(err)
	//		 }
	//
	//		 // Throwing an expected error
	//		 if name == "" {
	//       panic("The argument \"name\" cannot be empty ")
	//     }
	expected := false
	err, _ := info.(error)
	if err == nil {
		err = errors.New(fmt.Sprint(info))
		expected = true
	}

	conf := app.CoreConfig()
	if r.Method == "POST" {
		if !expected && conf.Debug != nil && conf.Debug.PanicOnUnexpectedJSONErrors {
			panic(err)
		}
		resp := appHandler.JSONResponse(w, r)
		resp.MustFailWithError(appdef.ErrGeneric, err, expected)
	} else {
		if !expected && conf.Debug != nil && conf.Debug.PanicOnUnexpectedHTMLErrors {
			panic(err)
		}
		resp := appHandler.HTMLResponse(w, r)
		resp.MustFailWithError(err, expected)
	}
}
