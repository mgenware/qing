package mpapi

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apicom"
)

var myPostsColumnNameToEnumMap map[string]int

func init() {
	myPostsColumnNameToEnumMap = map[string]int{
		defs.Shared.ColumnComments: da.PostTableSelectItemsForDashboardOrderBy1CmtCount,
		defs.Shared.ColumnCreated:  da.PostTableSelectItemsForDashboardOrderBy1CreatedAt,
		defs.Shared.ColumnLikes:    da.PostTableSelectItemsForDashboardOrderBy1Likes,
	}
}

type dashboardPost struct {
	da.PostTableSelectItemsForDashboardResult

	EID string `json:"id"`
	URL string `json:"url"`
}

func newDashboardPost(p *da.PostTableSelectItemsForDashboardResult, uid uint64) *dashboardPost {
	d := &dashboardPost{PostTableSelectItemsForDashboardResult: *p}
	d.URL = app.URL.Post(p.ID)
	d.EID = validator.EncodeID(uid)
	return d
}

func myPosts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := validator.GetPageParamFromDict(params)
	pageSize := validator.MustGetIntFromDict(params, defs.Shared.KeyPageSize)
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Shared.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

	rawPosts, hasNext, err := da.Post.SelectItemsForDashboard(app.DB, uid, page, pageSize, myPostsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(app.DB, uid)
	app.PanicIfErr(err)

	posts := make([]*dashboardPost, len(rawPosts))
	for i, p := range rawPosts {
		posts[i] = newDashboardPost(p, uid)
	}
	respData := apicom.NewPaginatedList(posts, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
