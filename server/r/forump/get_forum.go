package postp

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
)

const defaultPageSize = 10

var vNoContentView = app.MasterPageManager.MustParseView("/home/noContentView.html")

// GetForum is the HTTP handler for forums.
func GetForum(w http.ResponseWriter, r *http.Request) handler.HTML {
	var err error
	pid, err := validator.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := validator.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(defs.Constants.KeyTab)

	db := app.DB
	post, err := da.Forum.SelectForum(db, pid)
	app.PanicIfErr(err)

	var items []*da.ForumThreadInterface
	var hasNext bool

	if tab == defs.Constants.KeyDiscussions {
		items, hasNext, err = da.Forum.SelectDiscussions(db, page, defaultPageSize)
	} else if tab == defs.Constants.KeyQuestions {
		items, hasNext, err = da.Forum.SelectDiscussions(db, page, defaultPageSize)
	} else {
		items, hasNext, err = da.Forum.SelectThreads(db, page, defaultPageSize)
	}
	app.PanicIfErr(err)

	var feedListHTMLBuilder strings.Builder
	for _, item := range items {
		itemData, err := NewStdPageItemData(item)
		app.PanicIfErr(err)
		feedListHTMLBuilder.WriteString(vStdThreadItem.MustExecuteToString(itemData))
	}

	pageURLFormatter := &HomePageURLFormatter{Tab: tab}
	pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	userData := NewStdPageData(pageData, feedListHTMLBuilder.String(), pageBarHTML)
	d := app.MasterPageData("", vStdPage.MustExecuteToString(resp.Lang(), userData))
	d.Scripts = app.MasterPageManager.AssetsManager.JS.HomeStd
	return resp.MustComplete(d)
}
