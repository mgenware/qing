package cmtapi

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

var kCmtPageSize int

func init() {
	if app.Config.DevMode() {
		// Use a smaller for testing purposes.
		kCmtPageSize = 3
	} else {
		kCmtPageSize = 10
	}
}

type GetCmtsRespData struct {
	Items   []*apidata.Cmt `json:"items"`
	HasNext bool           `json:"hasNext"`
}

type GetRepliesRespData struct {
	Items   []*apidata.Reply `json:"items"`
	HasNext bool             `json:"hasNext"`
}

func newGetCmtsRespData(cmts []*da.CmtData, hasNext bool) *GetCmtsRespData {
	cmtsConverted := make([]*apidata.Cmt, len(cmts))
	for i := 0; i < len(cmts); i++ {
		cmtsConverted[i] = apidata.NewCmt(cmts[i])
	}
	res := &GetCmtsRespData{}
	res.Items = cmtsConverted
	res.HasNext = hasNext
	return res
}

func newGetRepliesRespData(replies []*da.ReplyData, hasNext bool) *GetRepliesRespData {
	repliesConverted := make([]*apidata.Reply, len(replies))
	for i := 0; i < len(replies); i++ {
		repliesConverted[i] = apidata.NewReply(replies[i])
	}
	res := &GetRepliesRespData{}
	res.Items = repliesConverted
	res.HasNext = hasNext
	return res
}

func getCmts(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())

	parentCmtID := validator.GetIDFromDict(params, "parentCmtID")
	page := validator.GetPageParamFromDict(params)

	db := app.DB
	// Selecting replies.
	if parentCmtID != 0 {
		replies, hasNext, err := da.Reply.SelectReplies(db, parentCmtID, page, kCmtPageSize)
		if err != nil {
			app.PanicIfErr(err)
		}

		respData := newGetRepliesRespData(replies, hasNext)
		return resp.MustComplete(respData)
	}

	// Selecting comments.
	hostID := validator.MustGetIDFromDict(params, "hostID")
	hostType := validator.MustGetIntFromDict(params, "hostType")
	var respData *GetCmtsRespData
	switch hostType {
	case defs.Constants.EntityPost:
		{
			cmts, hasNext, err := da.Post.SelectCmts(db, hostID, page, kCmtPageSize)
			if err != nil {
				app.PanicIfErr(err)
			}
			respData = newGetCmtsRespData(cmts, hasNext)
		}
		break
	default:
		{
			panic("Unsupported entity type")
		}
	}
	return resp.MustComplete(respData)
}
