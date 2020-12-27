package forump

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
)

// GetForumSettingsPageModel is the model type for forum settings page.
type GetForumSettingsPageModel struct {
	ForumEditable bool
}

// NewGetForumSettingsPageModel creates a new GetForumSettingsPageModel.
func NewGetForumSettingsPageModel(editable bool) *GetForumSettingsPageModel {
	d := &GetForumSettingsPageModel{}
	d.ForumEditable = editable
	return d
}

func getForumSettings(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)

	// Page title and content will be set on frontend side.
	d := app.MasterPageData("", "")

	return resp.MustComplete(d)
}
