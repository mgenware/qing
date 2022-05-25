/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package app

import (
	"net/http"
	"qing/a/appcom"
)

// ContextLanguage returns context localization language ID in the given request.
func ContextLanguage(r *http.Request) string {
	return appcom.ContextLanguage(r.Context())
}

// ContextSID returns context SID in the given request.
func ContextSID(r *http.Request) string {
	return appcom.ContextSID(r.Context())
}

// ContextUser returns context user in the given request.
func ContextUser(r *http.Request) *appcom.SessionUser {
	return appcom.ContextUser(r.Context())
}

// ContextUserID returns context user ID in the given request.
func ContextUserID(r *http.Request) uint64 {
	return appcom.ContextUserID(r.Context())
}

// ContextDict returns context dict in the given request.
func ContextDict(r *http.Request) map[string]any {
	return appcom.ContextDict(r.Context())
}
