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
	page := validator.GetPageParamFromRequestQueryString(r)
	tab := r.FormValue(defs.Constants.KeyTab)
	resp := app.HTMLResponse(w, r)

	// User profile
	user, err := da.User.SelectProfile(app.DB, uid)
	app.PanicIfErr(err)

	// User stats
	stats, err := da.UserStats.SelectStats(app.DB, uid)
	app.PanicIfErr(err)

	pageTitle := user.Name
	db := app.DB

	var feedListHTML string
	var hasNext bool
	switch tab {
	default:
		{
			var posts []*da.PostTableSelectItemsForUserProfileResult
			posts, hasNext, err = da.Post.SelectItemsForUserProfile(db, uid, page, defs.UserPostsLimit)
			app.PanicIfErr(err)
			var feedListHTMLBuilder strings.Builder
			for _, post := range posts {
				postData := NewProfilePostItem(post)
				feedListHTMLBuilder.WriteString(vProfileFeedItem.MustExecuteToString(postData))
			}
			feedListHTML = feedListHTMLBuilder.String()
			break
		}

	case defs.Constants.KeyDiscussions:
		{
			var discussions []*da.DiscussionTableSelectItemsForUserProfileResult
			discussions, hasNext, err = da.Discussion.SelectItemsForUserProfile(db, uid, page, defs.UserPostsLimit)
			app.PanicIfErr(err)
			var feedListHTMLBuilder strings.Builder
			for _, discussion := range discussions {
				discussionData := NewProfileDiscussionItem(discussion)
				feedListHTMLBuilder.WriteString(vProfileFeedItem.MustExecuteToString(discussionData))
			}
			feedListHTML = feedListHTMLBuilder.String()
			break
		}
	}

	pageURLFormatter := &ProfilePageURLFormatter{ID: uid, Tab: tab}
	pageData := rcm.NewPageData(page, hasNext, pageURLFormatter, 0)

	if feedListHTML == "" {
		feedListHTML = "<no-content-view></no-content-view>"
	}
	userData := NewProfilePageDataFromUser(user, stats, feedListHTML, rcm.GetPageBarHTML(pageData))
	d := app.MasterPageData(pageTitle, vProfilePage.MustExecuteToString(resp.Lang(), userData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Profile
	return resp.MustComplete(d)
}
