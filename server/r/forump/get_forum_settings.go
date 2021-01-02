package forump

import (
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/lib/validator"
	"qing/r/sys"

	"github.com/go-chi/chi"
)

// ForumSettingsPageWindData ...
type ForumSettingsPageWindData struct {
	EID string
}

// NewForumSettingsPageWindData creates a new ForumSettingsPageWindData.
func NewForumSettingsPageWindData(fid uint64) ForumSettingsPageWindData {
	d := ForumSettingsPageWindData{}
	d.EID = validator.EncodeID(fid)
	return d
}

func getForumSettings(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	fid, err := validator.DecodeID(chi.URLParam(r, "fid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}

	// Page title and content will be set on frontend side.
	d := app.MasterPageData("", "")
	d.Scripts = app.MasterPageManager.AssetsManager.JS.ForumSettings
	d.WindData = NewForumSettingsPageWindData(fid)

	return resp.MustComplete(d)
}
