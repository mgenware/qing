package postp

import (
	"net/http"
	"qing/app"
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

	db := app.DB
	post, err := da.Forum.SelectForum(db, pid)
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	postData := NewPostPageData(post)
	title := post.Title
	d := app.MasterPageData(title, vPostPage.MustExecuteToString(postData))
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Post
	return resp.MustComplete(d)
}
