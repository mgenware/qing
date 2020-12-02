package discussionp

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

// GetDiscussion is the HTTP handler for discussions.
func GetDiscussion(w http.ResponseWriter, r *http.Request) handler.HTML {
	tid, err := validator.DecodeID(chi.URLParam(r, "tid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	// Get discussion.
	page := validator.GetPageParamFromRequestQueryString(r)
	discussion, err := da.Discussion.SelectItemByID(app.DB, tid)
	app.PanicIfErr(err)

	// Get messages.
	rawMsgs, hasNext, err := da.DiscussionMsg.SelectItemsByDiscussion(app.DB, tid, page, defaultPageSize)
	app.PanicIfErr(err)

	var msgListBuilder strings.Builder
	for _, m := range rawMsgs {
		msgData := NewDiscussionMsgData(m)
		msgListBuilder.WriteString(vMessageItem.MustExecuteToString(msgData))
	}

	// Setup page data.
	pageURLFormatter := &DiscussionPageURLFormatter{ID: tid}
	pageData := rcm.NewPageData(page, hasNext, pageURLFormatter, int(discussion.MsgCount))
	pageBarHTML := rcm.GetPageBarHTML(pageData)

	resp := app.HTMLResponse(w, r)
	discussionData := NewDiscussionPageData(discussion, msgListBuilder.String(), pageBarHTML)
	title := discussion.Title
	d := app.MasterPageData(title, vDiscussionPage.MustExecuteToString(discussionData))
	d.Scripts = app.MasterPageManager.AssetsManager.JS.Discussion
	return resp.MustComplete(d)
}
