package template

import (
	"context"
	"qing/app/cm"
)

// BaseResponse provides basic properties shared by both HTMLResponse and JSONResponse.
type BaseResponse struct {
	ctx  context.Context
	mgr  *Manager
	lang string
}

func newBaseResponse(ctx context.Context, mgr *Manager) BaseResponse {
	c := BaseResponse{
		ctx:  ctx,
		lang: cm.LanguageContext(ctx),
		mgr:  mgr,
	}

	return c
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

// LocalizedPageTitle calls TemplateManager.LocalizedPageTitle.
func (b *BaseResponse) LocalizedPageTitle(key string) string {
	return b.mgr.LocalizedPageTitle(b.lang, key)
}
