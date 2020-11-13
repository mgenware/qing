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

var myPostsColumnNameToEnumMap map[string]int

func init() {
	myPostsColumnNameToEnumMap = map[string]int{
		defs.Constants.ColumnComments: da.PostTableSelectItemsForDashboardOrderBy1CmtCount,
		defs.Constants.ColumnCreated:  da.PostTableSelectItemsForDashboardOrderBy1CreatedAt,
		defs.Constants.ColumnLikes:    da.PostTableSelectItemsForDashboardOrderBy1Likes,
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
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	page := validator.GetPageParamFromDict(params)
	pageSize := validator.MustGetIntFromDict(params, "pageSize")
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Constants.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

	rawPosts, hasNext, err := da.Post.SelectItemsForDashboard(app.DB, uid, page, pageSize, myPostsColumnNameToEnumMap[sortBy], desc)
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
