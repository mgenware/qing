package template

import (
	"context"
	"net/http"
	"qing/app/cm"
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

func (b *BaseResponse) Request() *http.Request {
	return b.req
}

func (b *BaseResponse) Context() context.Context {
	return b.ctx
}

func (b *BaseResponse) Lang() string {
	return b.lang
}

// LocalizedString calls TemplateManager.LocalizedString.
func (b *BaseResponse) LocalizedString(key string) string {
	return b.mgr.LocalizedString(b.lang, key)
}

// FormatLocalizedString calls TemplateManager.FormatLocalizedString.
func (b *BaseResponse) FormatLocalizedString(key string, a ...interface{}) string {
	return b.mgr.FormatLocalizedString(b.lang, key, a...)
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
