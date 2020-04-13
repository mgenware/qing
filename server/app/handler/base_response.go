package handler

import (
	"context"
	"net/http"
	"qing/app/cm"
	"qing/app/handler/localization"
)

// BaseResponse provides basic properties shared by both HTMLResponse and JSONResponse.
type BaseResponse struct {
	req  *http.Request
	ctx  context.Context
	mgr  *Manager
	lang string
	user *cm.User
	uid  uint64
}

func newBaseResponse(r *http.Request, mgr *Manager) BaseResponse {
	ctx := r.Context()
	c := BaseResponse{
		req:  r,
		ctx:  ctx,
		lang: cm.LanguageContext(ctx),
		mgr:  mgr,
		user: cm.ContextUser(ctx),
		uid:  cm.ContextUserID(ctx),
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

// Dictionary returns the dictionary associated with current language ID.
func (b *BaseResponse) Dictionary() *localization.Dictionary {
	return b.mgr.Dictionary(b.Lang())
}

// PageTitle calls TemplateManager.PageTitle.
func (b *BaseResponse) PageTitle(s string) string {
	return b.mgr.PageTitle(b.lang, s)
}

// User returns the session user assosicated with the underlying context.
func (b *BaseResponse) User() *cm.User {
	return b.user
}

// UserID returns the ID of the session user assosicated with the underlying context.
func (b *BaseResponse) UserID() uint64 {
	return b.uid
}
