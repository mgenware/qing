package testp

import (
	"net/http"
	"qing/app"
)

func home(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)

	content := "<test-page></test-page>"
	d := app.MasterPageData("", content)
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Dashboard

	resp.MustComplete(d)
}
