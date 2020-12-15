package sys

import (
	"errors"
	"fmt"
	"net/http"

	"qing/app"
	"qing/app/defs"
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

	if r.Method == "POST" {
		if !expected && app.Config.Debug != nil && app.Config.Debug.PanicOnUnexpectedJSONErrors {
			panic(err)
		}
		resp := app.JSONResponse(w, r)
		resp.MustFailWithError(defs.Shared.ErrGeneric, err, expected)
	} else {
		if !expected && app.Config.Debug != nil && app.Config.Debug.PanicOnUnexpectedHTMLErrors {
			panic(err)
		}
		resp := app.HTMLResponse(w, r)
		resp.MustFailWithError(err, expected)
	}
}
