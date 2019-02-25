package system

import (
	"net/http"

	"qing/app"
	"qing/app/logx"
	"qing/app/template"
)

// NotFoundHandler is a application wide handler for 404 errors.
func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)
	msg := resp.FormatLocalizedString("pPageNotFound", r.URL.String())

	if app.Config.DevMode {
		app.Logger.LogError("app.http.404", logx.D{"url": r.URL.String()})
	}

	// Note that we don't simply use `resp.MustFailWithMessage(msg)` to show this error, because that would panic in dev mode, so we used a more primitive way below to set `ErrorPageData.Expected` to `false`, thus doesn't trigger panic in dev mode for all 404 errors.
	errorData := &template.ErrorPageData{Message: msg, Expected: true}
	app.TemplateManager.MustError(resp.Lang(), errorData, w)
}
