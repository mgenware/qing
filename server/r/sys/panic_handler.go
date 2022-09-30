// The original work was derived from Goji's middleware, source:
// https://github.com/zenazn/goji/tree/master/web/middleware
// https://github.com/go-chi/chi/blob/master/middleware/recoverer.go

package sys

import (
	"errors"
	"fmt"
	"net/http"
	"runtime/debug"

	"qing/a/app"
	"qing/a/appConf"
	"qing/a/appLog"
	"qing/a/def/appdef"
)

func PanicMiddleware(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rvr := recover(); rvr != nil {
				if appConf.Get().DevMode() {
					fmt.Println("Stacktrace from panic: \n" + string(debug.Stack()))
				}

				if rvr == http.ErrAbortHandler {
					// we don't recover http.ErrAbortHandler so the response
					// to the client is aborted, this should not be logged
					panic(rvr)
				}

				msg := fmt.Sprintf("%v", rvr)
				appLog.Get().Error("panic-handler.fatal", "err", msg, "url", r.URL.String(), "method", r.Method)

				if r.Method == "POST" {
					resp := app.JSONResponse(w, r)
					resp.MustFailWithCodeAndError(appdef.ErrGeneric, errors.New(msg))
				} else {
					w.WriteHeader(http.StatusInternalServerError)
					fmt.Fprint(w, msg)
				}
			}
		}()

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}
