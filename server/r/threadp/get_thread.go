package threadp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v5/strconvx"
)

const defaultPageSize = 20

// GetThread is the HTTP handler for threads.
func GetThread(w http.ResponseWriter, r *http.Request) handler.HTML {
	tid, err := validator.DecodeID(chi.URLParam(r, "tid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	page, _ := strconvx.ParseInt(r.FormValue("page"))
	thread, err := da.Thread.SelectItemByID(app.DB, tid)
	app.PanicIfErr(err)

	rawMsgs, hasNext, err := da.ThreadMsg.SelectItemsByThread(app.DB, tid, page, defaultPageSize)
	app.PanicIfErr(err)

	var msgListBuilder strings.Builder
	for _, m := range rawMsgs {
		msgData := NewThreadMsgData(m)
		msgListBuilder.WriteString(vMessageItem.MustExecuteToString(msgData))
	}

	resp := app.HTMLResponse(w, r)
	threadData := NewThreadPageData(thread, msgListBuilder.String())
	title := thread.Title
	d := app.MasterPageData(title, vThreadPage.MustExecuteToString(threadData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Post
	return resp.MustComplete(d)
}
