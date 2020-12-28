package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"qing/app/defs"
	"qing/app/handler"

	"github.com/mgenware/go-packagex/v5/httpx"
)

// ParseJSONMiddleware is a middleware that parses the request body as JSON and stores the result to the context.
func ParseJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		contentType := r.Header.Get("Content-Type")
		if contentType == httpx.MIMETypeJSON {
			decoder := json.NewDecoder(r.Body)
			jsonMap := make(map[string]interface{})
			err := decoder.Decode(&jsonMap)
			if err != nil {
				resp := handler.NewJSONResponse(r, w)
				// JSON parsing errors are considered user errors, so we pass `true` as `expected` and don't log them.
				resp.MustFailWithError(defs.Shared.ErrGeneric, fmt.Errorf("Error parsing body JSON, \"%v\"", err.Error()), true)
				return
			}
			ctx = context.WithValue(ctx, defs.DictContextKey, jsonMap)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}