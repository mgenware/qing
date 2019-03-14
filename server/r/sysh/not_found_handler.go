package sysh

import (
	"net/http"

	"qing/app"
	"qing/app/template"
)

// NotFoundHandler is a application wide handler for 404 errors.
func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	// Set 404 status code
	w.WriteHeader(http.StatusNotFound)
	resp := app.HTMLResponse(w, r)
	msg := resp.FormatLocalizedString("pPageNotFound", r.URL.String())

	if app.Config.HTTP.Log404Error {
		app.Logger.NotFound("http", r.URL.String())
	}

	// Note that we don't use `resp.MustFailWithMessage(msg)` to show this error, because that would panic in dev mode. Instead, we set `ErrorPageData.Expected` to `true` so that a 404 response won't cause panic and logging in `app.TemplateManager.MustError`.
	errorData := &template.ErrorPageData{Message: msg, Expected: true}
	app.TemplateManager.MustError(r, resp.Lang(), errorData, w)
}
