package profilep

import (
	"log"
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validate2"
	"qing/r/sysh"
	"strings"

	"github.com/go-chi/chi"
)

func ProfileGET(w http.ResponseWriter, r *http.Request) {
	log.Print("okok")
	uid, err := app.URL.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		sysh.NotFoundHandler(w, r)
		return
	}
	page := validate2.MustToPageOrDefault(r.FormValue("page"), "page")
	limit, offset := validate2.DBLimitAndOffset(page, defs.UserPostsLimit)

	user, err := da.User.SelectProfile(app.DB, uid)
	app.PanicIfErr(err)
	resp := app.HTMLResponse(w, r)

	title := user.Name
	userData := NewProfileDataFromUser(user)

	// Populate posts
	posts, err := da.Post.SelectPostsByUser(app.DB, uid, limit, offset)
	app.PanicIfErr(err)
	var sb strings.Builder
	for _, post := range posts {
		postData := NewPostItem(post)
		sb.WriteString(vProfilePostItem.MustExecuteToString(resp.Lang(), postData))
	}
	userData.FeedListHTML = sb.String()

	d := app.MasterPageData(title, vProfilePage.MustExecuteToString(resp.Lang(), userData))
	resp.MustComplete(d)
}
