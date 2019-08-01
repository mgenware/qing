package postp

import (
	"net/http"
	"qing/app"
	"qing/da"
	"qing/r/sysh"

	"github.com/go-chi/chi"
)

func PostGET(w http.ResponseWriter, r *http.Request) {
	pid, err := app.URL.DecodeID(chi.URLParam(r, "pid"))
	if err != nil {
		sysh.NotFoundHandler(w, r)
		return
	}
	post, err := da.Post.SelectPostByID(app.DB, pid)
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	postData := NewPostPageData(post)
	title := post.Title
	d := app.MasterPageData(title, vPostPage.MustExecuteToString(resp.Lang(), postData))
	resp.MustComplete(d)
}
