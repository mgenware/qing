package t

import (
	"net/http"
	"qing/app"
)

func home(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)

	content := "<t-page></t-page>"
	d := app.MasterPageData("", content)
	d.Scripts = app.TemplateManager.AssetsManager.JS.Dashboard

	resp.MustComplete(d)
}
