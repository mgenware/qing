/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"qing/a/def"
	"qing/a/def/appdef"
	"qing/a/handler"

	"github.com/mgenware/goutil/httpx"
)

// ParseJSON is a middleware that parses the request body as JSON and stores the result to the context.
func ParseJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		contentType := r.Header.Get("Content-Type")
		if contentType == httpx.MIMETypeJSON {
			decoder := json.NewDecoder(r.Body)
			jsonMap := make(map[string]interface{})
			err := decoder.Decode(&jsonMap)
			if err != nil && err != io.EOF {
				resp := handler.NewJSONResponse(r, w)
				// JSON parsing errors are considered user errors, so we pass `true` as `expected` and don't log them.
				resp.MustFailWithError(appdef.ErrGeneric, fmt.Errorf("error parsing body JSON, \"%v\"", err.Error()), true)
				return
			}
			ctx = context.WithValue(ctx, def.DictContextKey, jsonMap)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
