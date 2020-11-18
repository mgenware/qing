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

var myThreadsColumnNameToEnumMap map[string]int

func init() {
	myThreadsColumnNameToEnumMap = map[string]int{
		defs.Constants.ColumnMessages: da.ThreadTableSelectItemsForDashboardOrderBy1MsgCount,
		defs.Constants.ColumnCreated:  da.ThreadTableSelectItemsForDashboardOrderBy1CreatedAt,
	}
}

type dashboardThread struct {
	da.ThreadTableSelectItemsForDashboardResult

	EID string `json:"id"`
	URL string `json:"url"`
}

func newDashboardThread(p *da.ThreadTableSelectItemsForDashboardResult, uid uint64) *dashboardThread {
	d := &dashboardThread{ThreadTableSelectItemsForDashboardResult: *p}
	d.URL = app.URL.Thread(p.ID)
	d.EID = validator.EncodeID(uid)
	return d
}

func myThreads(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	page := validator.GetPageParamFromDict(params)
	pageSize := validator.MustGetIntFromDict(params, defs.Constants.KeyPageSize)
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Constants.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

	rawThreads, hasNext, err := da.Thread.SelectItemsForDashboard(app.DB, uid, page, pageSize, myThreadsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(app.DB, uid)
	app.PanicIfErr(err)

	threads := make([]*dashboardThread, len(rawThreads))
	for i, p := range rawThreads {
		threads[i] = newDashboardThread(p, uid)
	}
	respData := apidata.NewPaginatedList(threads, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
