package threadp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

// GetThread is the HTTP handler for threads.
func GetThread(w http.ResponseWriter, r *http.Request) handler.HTML {
	pid, err := validator.DecodeID(chi.URLParam(r, "tid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	thread, err := da.Thread.SelectPostByID(app.DB, pid)
	app.PanicIfErr(err)

	resp := app.HTMLResponse(w, r)
	threadData := NewThreadPageData(thread)
	title := thread.Title
	d := app.MasterPageData(title, vThreadPage.MustExecuteToString(resp.Lang(), threadData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Post
	return resp.MustComplete(d)
}
