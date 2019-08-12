package sys

import (
	"errors"
	"net/http"

	"qing/app"
)

// NotFoundGET is a application wide handler for 404 errors.
func NotFoundGET(w http.ResponseWriter, r *http.Request) {
	// Set 404 status code
	w.WriteHeader(http.StatusNotFound)
	resp := app.HTMLResponse(w, r)
	msg := resp.FormatLocalizedString("pPageNotFound", r.URL.String())

	if app.Config.HTTP.Log404Error {
		app.Logger.NotFound("http", r.URL.String())
	}

	// Note that pass `true` as the `expected` param so that template manager won't treat it as a 500 error.
	app.TemplateManager.MustError(r, resp.Lang(), errors.New(msg), true, w)
}
