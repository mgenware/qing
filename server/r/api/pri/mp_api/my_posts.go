package mpapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apidata"
)

var columnNameToEnumMap map[string]int

func init() {
	columnNameToEnumMap = map[string]int{
		defs.Constants.ColumnComments: da.PostTableSelectPostsForDashboardOrderBy1CmtCount,
		defs.Constants.ColumnCreated:  da.PostTableSelectPostsForDashboardOrderBy1CreatedAt,
		defs.Constants.ColumnLikes:    da.PostTableSelectPostsForDashboardOrderBy1Likes,
	}
}

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

func myPosts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	page := validator.MustGetIntFromDict(params, "page")
	pageSize := validator.MustGetIntFromDict(params, "pageSize")
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Constants.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

	rawPosts, hasNext, err := da.Post.SelectPostsForDashboard(app.DB, uid, page, pageSize, columnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(app.DB, uid)
	app.PanicIfErr(err)

	posts := make([]*dashboardPost, len(rawPosts))
	for i, p := range rawPosts {
		posts[i] = newDashboardPost(p, uid)
	}
	respData := apidata.NewPaginatedList(posts, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
