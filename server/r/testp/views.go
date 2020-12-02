package testp

import (
	"net/http"
	"qing/app"
)

func views(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)

	content := "<views-demo></views-demo>"
	d := app.MasterPageData("", content)
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Dashboard

	resp.MustComplete(d)
}
