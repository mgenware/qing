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

// GetPost is the HTTP handler for posts.
func GetPost(w http.ResponseWriter, r *http.Request) handler.HTML {
	pid, err := validator.DecodeID(chi.URLParam(r, "pid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	post, err := da.Post.SelectItemByID(app.DB, pid)
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	postModel := NewPostPageModel(&post)
	title := post.Title
	d := app.MasterPageData(title, vPostPage.MustExecuteToString(postModel))
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Post
	return resp.MustComplete(d)
}
