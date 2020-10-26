package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"

	"github.com/mgenware/go-packagex/v5/httpx"
)

// ParseJSONRequest is a middleware to parse request body as JSON and store the result to the context.
func ParseJSONRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		contentType := r.Header.Get("Content-Type")
		if contentType == httpx.MIMETypeJSON {
			decoder := json.NewDecoder(r.Body)
			jsonMap := make(map[string]interface{})
			err := decoder.Decode(&jsonMap)
			if err != nil {
				resp := handler.NewJSONResponse(r, app.TemplateManager, w)
				// JSON parsing errors are considered user errors, so we pass `true` as `expected` and don't log them.
				resp.MustFailWithError(defs.Constants.ErrGeneric, fmt.Errorf("Error parsing body JSON, \"%v\"", err.Error()), true)
				return
			}
			ctx = context.WithValue(ctx, defs.BodyContextKey, jsonMap)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
