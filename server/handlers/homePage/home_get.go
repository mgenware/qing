package homePage

import (
	"net/http"
	"time"

	"qing/app"
)

var indexView = app.TemplateManager.MustParseLocalizedView("home.html")

func HomeGET(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)

	pageData := &HomePageData{Time: time.Now().String()}
	pageHTML := indexView.MustExecuteToString(resp.Lang(), pageData)

	d := app.MasterPageData(resp.LocalizedPageTitle("home"), pageHTML)
	resp.MustComplete(d)
}
