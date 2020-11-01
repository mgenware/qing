package profilep

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcm"
	"qing/r/sys"
	"strings"

	"github.com/go-chi/chi"
)

func GetProfile(w http.ResponseWriter, r *http.Request) handler.HTML {
	uid, err := validator.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := validator.MustToPageOrDefault(r.FormValue("page"))
	resp := app.HTMLResponse(w, r)

	// User profile
	user, err := da.User.SelectProfile(app.DB, uid)
	app.PanicIfErr(err)

	// User stats
	stats, err := da.UserStats.SelectStats(app.DB, uid)
	app.PanicIfErr(err)

	title := user.Name

	// User posts
	posts, hasNext, err := da.Post.SelectItemsForUserProfile(app.DB, uid, page, defs.UserPostsLimit)
	app.PanicIfErr(err)
	var sb strings.Builder
	for _, post := range posts {
		postData := NewProfilePostItem(post)
		sb.WriteString(vProfilePostItem.MustExecuteToString(postData))
	}
	feedListHTML := sb.String()
	pageURLFormatter := &ProfilePageURLFormatter{ID: uid}
	pageData := rcm.NewPageData(page, hasNext, pageURLFormatter, 0)

	userData := NewProfilePageDataFromUser(user, stats, feedListHTML, pageData)
	d := app.MasterPageData(title, vProfilePage.MustExecuteToString(resp.Lang(), userData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Profile
	return resp.MustComplete(d)
}
