package template

import (
	"context"

	"qing/app/defs"
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
		lang: defs.LanguageContext(ctx),
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

// NewTitle calls TemplateManager.NewTitle.
func (b *BaseResponse) NewTitle(t string) string {
	return b.mgr.NewTitle(t)
}

// NewLocalizedTitle calls TemplateManager.NewLocalizedTitle.
func (b *BaseResponse) NewLocalizedTitle(key string) string {
	return b.mgr.NewLocalizedTitle(b.lang, key)
}
