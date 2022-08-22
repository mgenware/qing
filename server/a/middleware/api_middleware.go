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
	"qing/a/appHandler"
	"qing/a/def"
	"qing/a/def/appdef"
	"qing/a/handler"

	"github.com/mgenware/goutil/httpx"
)

// Middleware used by all APIs. It does the following things:
// 1. Parse request JSON and save it to context.
// 2. Parse request lang and save it to context.
func APIMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		contentType := r.Header.Get("Content-Type")
		if contentType == httpx.MIMETypeJSON {
			decoder := json.NewDecoder(r.Body)
			jsonMap := make(map[string]any)
			err := decoder.Decode(&jsonMap)
			if err != nil && err != io.EOF {
				resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
				resp.MustFailWithCodeAndError(appdef.ErrGeneric, fmt.Errorf("error parsing body JSON, \"%v\"", err.Error()))
				return
			}

			apiLang := jsonMap[appdef.ApiLangParam]
			if apiLang == "" {
				resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
				resp.MustFailWithCodeAndError(appdef.ErrGeneric, fmt.Errorf("missing API lang, \"%v\"", err.Error()))
				return
			}

			ctx = context.WithValue(ctx, def.DictContextKey, jsonMap)
			ctx = context.WithValue(ctx, def.LanguageContextKey, apiLang)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
