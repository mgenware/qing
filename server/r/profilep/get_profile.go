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

func entityTypeFromTabString(tab string) int {
	switch tab {
	case defs.Constants.EntityPostsName:
		return defs.Constants.EntityPost
	case defs.Constants.EntityThreadsName:
		return defs.Constants.EntityThread
	case defs.Constants.EntityAnswersName:
		return defs.Constants.EntityAnswer
	}
	return -1
}

func GetProfile(w http.ResponseWriter, r *http.Request) handler.HTML {
	uid, err := validator.DecodeID(chi.URLParam(r, "uid"))
	if err != nil {
		return sys.NotFoundGET(w, r)
	}
	page := validator.GetPageParamFromRequestQueryString(r)
	tabEntityType := entityTypeFromTabString(r.FormValue("tab"))
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
	switch tabEntityType {
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

	case defs.Constants.EntityThread:
		{
			var threads []*da.ThreadTableSelectItemsForUserProfileResult
			threads, hasNext, err = da.Thread.SelectItemsForUserProfile(db, uid, page, defs.UserPostsLimit)
			app.PanicIfErr(err)
			var feedListHTMLBuilder strings.Builder
			for _, thread := range threads {
				threadData := NewProfileThreadItem(thread)
				feedListHTMLBuilder.WriteString(vProfileFeedItem.MustExecuteToString(threadData))
			}
			feedListHTML = feedListHTMLBuilder.String()
			break
		}
	}

	pageURLFormatter := &ProfilePageURLFormatter{ID: uid, Tab: tabEntityType}
	pageData := rcm.NewPageData(page, hasNext, pageURLFormatter, 0)

	userData := NewProfilePageDataFromUser(user, stats, feedListHTML, pageData)
	d := app.MasterPageData(pageTitle, vProfilePage.MustExecuteToString(resp.Lang(), userData))
	d.Scripts = app.TemplateManager.AssetsManager.JS.Profile
	return resp.MustComplete(d)
}
