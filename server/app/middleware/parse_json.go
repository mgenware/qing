package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/template"

	"github.com/mgenware/go-packagex/httpx"
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
				resp := template.NewJSONResponse(ctx, app.TemplateManager, w, app.Config.Debug)
				resp.MustFailWithCodeAndError(defs.APIGenericError, fmt.Errorf("Error parsing body JSON, \"%v\"", err.Error()))
				return
			}
			ctx = context.WithValue(ctx, defs.BodyContextKey, jsonMap)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
