package threadp

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
)

const defaultPageSize = 20

// GetThread is the HTTP handler for threads.
func GetThread(w http.ResponseWriter, r *http.Request) handler.HTML {
	tid, err := validator.DecodeID(chi.URLParam(r, "tid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	// Get thread.
	page := validator.GetPageParamFromRequestQueryString(r)
	thread, err := da.Thread.SelectItemByID(app.DB, tid)
	app.PanicIfErr(err)

	// Get messages.
	rawMsgs, hasNext, err := da.ThreadMsg.SelectItemsByThread(app.DB, tid, page, defaultPageSize)
	app.PanicIfErr(err)

	var msgListBuilder strings.Builder
	for _, m := range rawMsgs {
		msgData := NewThreadMsgData(m)
		msgListBuilder.WriteString(vMessageItem.MustExecuteToString(msgData))
	}

	// Setup page data.
	pageURLFormatter := &ThreadPageURLFormatter{ID: tid}
	pageData := rcm.NewPageData(page, hasNext, pageURLFormatter, int(thread.MsgCount))
	pageBarHTML := rcm.GetPageBarHTML(pageData)

	resp := app.HTMLResponse(w, r)
	threadData := NewThreadPageData(thread, msgListBuilder.String(), pageBarHTML)
	title := thread.Title
	d := app.MasterPageData(title, vThreadPage.MustExecuteToString(threadData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Post
	return resp.MustComplete(d)
}
