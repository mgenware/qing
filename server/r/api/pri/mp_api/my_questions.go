/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mpapi

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/def"
	"qing/a/handler"
	"qing/da"
	"qing/lib/clib"
	"qing/r/api/apicom"
)

var myQuestionsColumnNameToEnumMap map[string]int

func init() {
	myQuestionsColumnNameToEnumMap = map[string]int{
		def.App.ColumnMessages: da.QuestionTableSelectItemsForPostCenterOrderBy1ReplyCount,
		def.App.ColumnCreated:  da.QuestionTableSelectItemsForPostCenterOrderBy1CreatedAt,
	}
}

type pcQuestion struct {
	da.QuestionTableSelectItemsForPostCenterResult

	EID        string `json:"id"`
	URL        string `json:"url"`
	CreatedAt  string `json:"createdAt"`
	ModifiedAt string `json:"modifiedAt"`
}

func newPCQuestion(p *da.QuestionTableSelectItemsForPostCenterResult, uid uint64) pcQuestion {
	d := pcQuestion{QuestionTableSelectItemsForPostCenterResult: *p}
	d.URL = appURL.Get().Question(p.ID)
	d.EID = clib.EncodeID(uid)
	d.CreatedAt = clib.TimeString(d.RawCreatedAt)
	d.ModifiedAt = clib.TimeString(d.RawModifiedAt)
	return d
}

func myQuestions(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := clib.GetPageParamFromDict(params)
	pageSize := clib.MustGetIntFromDict(params, def.App.KeyPageSize)
	sortBy := clib.MustGetStringFromDict(params, "sort", def.App.MaxGenericStringLen)
	desc := clib.MustGetIntFromDict(params, "desc") != 0

	rawQuestions, hasNext, err := da.Question.SelectItemsForPostCenter(appDB.DB(), uid, page, pageSize, myQuestionsColumnNameToEnumMap[sortBy], desc)
	app.PanicIfErr(err)

	stats, err := da.UserStats.SelectStats(appDB.DB(), uid)
	app.PanicIfErr(err)

	questions := make([]pcQuestion, len(rawQuestions))
	for i, p := range rawQuestions {
		questions[i] = newPCQuestion(&p, uid)
	}
	respData := apicom.NewPaginatedList(questions, hasNext, stats.PostCount)
	return resp.MustComplete(respData)
}
