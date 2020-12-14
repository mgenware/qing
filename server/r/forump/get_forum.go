package forump

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

// GetForum is the HTTP handler for forums.
func GetForum(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	db := app.DB
	var err error

	pid, err := validator.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := validator.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(defs.Constants.KeyTab)

	forum, err := da.Forum.SelectForum(db, pid)
	app.PanicIfErr(err)

	var items []*da.UserThreadInterface
	var hasNext bool

	if tab == defs.Constants.KeyDiscussions {
		items, hasNext, err = da.Forum.SelectDiscussions(db, page, defaultPageSize)
	} else if tab == defs.Constants.KeyQuestions {
		items, hasNext, err = da.Forum.SelectQuestions(db, page, defaultPageSize)
	} else {
		items, hasNext, err = da.Forum.SelectThreads(db, page, defaultPageSize)
	}
	app.PanicIfErr(err)

	var feedListHTMLBuilder strings.Builder
	for _, item := range items {
		itemModel, err := rcom.NewUserThreadModel(item)
		app.PanicIfErr(err)
		feedListHTMLBuilder.WriteString(rcom.MustRunUserThreadViewTemplate(itemModel))
	}

	pageURLFormatter := NewForumPageURLFormatter(forum.ID, tab)
	pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
	pageBarHTML := rcom.GetPageBarHTML(pageData)

	pageModel := NewForumPageModel(forum, feedListHTMLBuilder.String(), pageBarHTML)
	d := app.MasterPageData("", vForumPage.MustExecuteToString(pageModel))
	d.Scripts = app.MasterPageManager.AssetsManager.JS.HomeFrm
	return resp.MustComplete(d)
}
