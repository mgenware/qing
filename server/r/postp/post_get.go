package postp

import (
	"net/http"
	"qing/app"
	"qing/da"
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

func PostGET(w http.ResponseWriter, r *http.Request) {
	pid, err := validator.DecodeID(chi.URLParam(r, "pid"))
	if err != nil {
		sys.NotFoundGET(w, r)
		return
	}
	post, err := da.Post.SelectPostByID(app.DB, pid)
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	postData := NewPostPageData(post)
	title := post.Title
	d := app.MasterPageData(title, vPostPage.MustExecuteToString(resp.Lang(), postData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Post
	resp.MustComplete(d)
}
