package cmtapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/da"
	"qing/lib/validator"
	"qing/r/api/apidata"

	"github.com/mgenware/go-packagex/v5/jsonx"
)

var kCmtPageSize int

func init() {
	if app.Config.DevMode() {
		// Use a smaller for testing purposes.
		kCmtPageSize = 3
	} else {
		kCmtPageSize = 10
	}
}

type ListCmtRespData struct {
	Items   []*apidata.Cmt `json:"items"`
	HasNext bool           `json:"hasNext"`
}

func newListCmtRespData(cmts []*da.CmtData, hasNext bool) *ListCmtRespData {
	cmtsConverted := make([]*apidata.Cmt, len(cmts))
	for i := 0; i < len(cmts); i++ {
		cmtsConverted[i] = apidata.NewCmt(cmts[i])
	}
	res := &ListCmtRespData{}
	res.Items = cmtsConverted
	res.HasNext = hasNext
	return res
}

func listCmt(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())

	entityID := validator.MustGetIDFromDict(params, "entityID")
	entityType := validator.MustGetIntFromDict(params, "entityType")
	page := jsonx.GetIntOrDefault(params, "page")

	db := app.DB
	var respData *ListCmtRespData
	switch entityType {
	case defs.EntityPost:
		{
			cmts, hasNext, err := da.Post.SelectCmts(db, entityID, page, kCmtPageSize)
			if err != nil {
				app.PanicIfErr(err)
			}
			respData = newListCmtRespData(cmts, hasNext)
		}
		break
	default:
		{
			panic("Unsupported entity type")
		}
	}
	resp.MustComplete(respData)
}
