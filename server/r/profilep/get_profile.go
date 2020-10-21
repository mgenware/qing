package profilep

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
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
	userData := NewProfileDataFromUser(user, stats)

	// User posts
	posts, hasNext, err := da.Post.SelectPostsForUserProfile(app.DB, uid, page, defs.UserPostsLimit)
	app.PanicIfErr(err)
	var sb strings.Builder
	for _, post := range posts {
		postData := NewPostItem(post)
		sb.WriteString(vProfilePostItem.MustExecuteToString(resp.Lang(), postData))
	}
	userData.FeedListHTML = sb.String()
	userData.Pager = cm.NewPager(page, hasNext, app.URL.UserProfileFormatter(uid))

	d := app.MasterPageData(title, vProfilePage.MustExecuteToString(resp.Lang(), userData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Profile
	return resp.MustComplete(d)
}
