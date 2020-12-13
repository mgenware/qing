package postp

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

// GetForum is the HTTP handler for forums.
func GetForum(w http.ResponseWriter, r *http.Request) handler.HTML {
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
	var err error

	if tab == defs.Constants.KeyDiscussions {
		items, hasNext, err = da.Forum.SelectDiscussions(db, page, defaultPageSize)
	} else if tab == defs.Constants.KeyQuestions {
		items, hasNext, err = da.Forum.SelectDiscussions(db, page, defaultPageSize)
	} else {
		items, hasNext, err = da.Forum.SelectThreads(db, page, defaultPageSize)
	}
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	postData := NewPostPageData(post)
	title := post.Title
	d := app.MasterPageData(title, vPostPage.MustExecuteToString(postData))
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Forum
	return resp.MustComplete(d)
}
