package indexp

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
	"strings"
)

const defaultPageSize = 10

func IndexHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	page := validator.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(defs.Constants.KeyTab)
	resp := app.HTMLResponse(w, r)

	items, hasNext, err := da.HomeTable.SelectItems(app.DB, page, defaultPageSize)
	app.PanicIfErr(err)

	var feedListHTMLBuilder strings.Builder
	for _, item := range items {
		itemData, err := NewIndexPageItemData(item)
		if err != nil {
			feedListHTMLBuilder.WriteString(vIndexItem.MustExecuteToString(itemData))
		}
	}

	pageURLFormatter := &IndexPageURLFormatter{Tab: tab}
	pageData := rcm.NewPageData(page, hasNext, pageURLFormatter, 0)

	userData := NewIndexPageData(feedListHTMLBuilder.String(), pageData)
	d := app.MasterPageData("", vIndexPage.MustExecuteToString(resp.Lang(), userData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Profile
	return resp.MustComplete(d)
}
