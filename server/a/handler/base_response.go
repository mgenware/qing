/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"context"
	"net/http"
	"qing/a/appcm"
)

// BaseResponse provides basic properties shared by both HTMLResponse and JSONResponse.
type BaseResponse struct {
	req  *http.Request
	ctx  context.Context
	lang string
	user *appcm.SessionUser
	uid  uint64
}

func newBaseResponse(r *http.Request) BaseResponse {
	ctx := r.Context()
	c := BaseResponse{
		req:  r,
		ctx:  ctx,
		lang: appcm.ContextLanguage(ctx),
		user: appcm.ContextUser(ctx),
		uid:  appcm.ContextUserID(ctx),
	}

	return c
}

// Request returns underlying http.Request.
func (b *BaseResponse) Request() *http.Request {
	return b.req
}

// Context returns context.Context associated with current request.
func (b *BaseResponse) Context() context.Context {
	return b.ctx
}

// Lang returns current language ID.
func (b *BaseResponse) Lang() string {
	return b.lang
}

// User returns the session user associated with the underlying context.
func (b *BaseResponse) User() *appcm.SessionUser {
	return b.user
}

// UserID returns the ID of the session user associated with the underlying context.
func (b *BaseResponse) UserID() uint64 {
	return b.uid
}
