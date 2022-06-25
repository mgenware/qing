// The original work was derived from Goji's middleware, source:
// https://github.com/zenazn/goji/tree/master/web/middleware
// https://github.com/go-chi/chi/blob/master/middleware/recoverer.go

package sys

import (
	"errors"
	"fmt"
	"net/http"

	"qing/a/appHandler"
	"qing/a/def/appdef"
)

func PanicMiddleware(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rvr := recover(); rvr != nil {
				if rvr == http.ErrAbortHandler {
					// we don't recover http.ErrAbortHandler so the response
					// to the client is aborted, this should not be logged
					panic(rvr)
				}

				msg := fmt.Sprintf("%v", rvr)

				if r.Method == "POST" {
					resp := appHandler.JSONResponse(w, r)
					resp.MustFailWithCodeAndError(appdef.ErrGeneric, errors.New(msg))
				} else {
					w.WriteHeader(http.StatusInternalServerError)
					fmt.Print(w, msg)
				}
			}
		}()

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}
