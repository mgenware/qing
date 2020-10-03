package mpapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apidata"
)

type dashboardPost struct {
	da.PostTableSelectPostsForDashboardResult

	EID string `json:"id"`
	URL string `json:"url"`
}

func newDashboardPost(p *da.PostTableSelectPostsForDashboardResult, uid uint64) *dashboardPost {
	d := &dashboardPost{PostTableSelectPostsForDashboardResult: *p}
	d.URL = app.URL.Post(p.ID)
	d.EID = validator.EncodeID(uid)
	return d
}

func myPostsPOST(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	page := validator.MustGetIntFromDict(params, "page")
	pageSize := validator.MustGetIntFromDict(params, "pageSize")

	rawPosts, hasNext, err := da.Post.SelectPostsForDashboard(app.DB, uid, page, pageSize)
	app.PanicIfErr(err)

	postCount, err := da.User.SelectPostCount(app.DB, uid)
	app.PanicIfErr(err)

	posts := make([]*dashboardPost, len(rawPosts))
	for i, p := range rawPosts {
		posts[i] = newDashboardPost(p, uid)
	}
	respData := apidata.NewPaginatedList(posts, hasNext, postCount)
	return resp.MustComplete(respData)
}
