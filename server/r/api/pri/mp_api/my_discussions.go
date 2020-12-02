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

var myDiscussionsColumnNameToEnumMap map[string]int

func init() {
	myDiscussionsColumnNameToEnumMap = map[string]int{
		defs.Constants.ColumnMessages: da.DiscussionTableSelectItemsForDashboardOrderBy1MsgCount,
		defs.Constants.ColumnCreated:  da.DiscussionTableSelectItemsForDashboardOrderBy1CreatedAt,
	}
}

type dashboardDiscussion struct {
	da.DiscussionTableSelectItemsForDashboardResult

	EID string `json:"id"`
	URL string `json:"url"`
}

func newDashboardDiscussion(p *da.DiscussionTableSelectItemsForDashboardResult, uid uint64) *dashboardDiscussion {
	d := &dashboardDiscussion{DiscussionTableSelectItemsForDashboardResult: *p}
	d.URL = app.URL.Discussion(p.ID)
	d.EID = validator.EncodeID(uid)
	return d
}

func myDiscussions(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := validator.GetPageParamFromDict(params)
	pageSize := validator.MustGetIntFromDict(params, defs.Constants.KeyPageSize)
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Constants.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

	rawDiscussions, hasNext, err := da.Discussion.SelectItemsForDashboard(app.DB, uid, page, pageSize, myDiscussionsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(app.DB, uid)
	app.PanicIfErr(err)

	discussions := make([]*dashboardDiscussion, len(rawDiscussions))
	for i, p := range rawDiscussions {
		discussions[i] = newDashboardDiscussion(p, uid)
	}
	respData := apicom.NewPaginatedList(discussions, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
