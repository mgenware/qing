/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mpapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/fmtx"
	"qing/lib/validator"
	"qing/r/api/apicom"
)

var myQuestionsColumnNameToEnumMap map[string]int

func init() {
	myQuestionsColumnNameToEnumMap = map[string]int{
		defs.Shared.ColumnMessages: da.QuestionTableSelectItemsForPostCenterOrderBy1ReplyCount,
		defs.Shared.ColumnCreated:  da.QuestionTableSelectItemsForPostCenterOrderBy1CreatedAt,
	}
}

type pcQuestion struct {
	da.QuestionTableSelectItemsForPostCenterResult

	EID string `json:"id"`
	URL string `json:"url"`
}

func newPCQuestion(p *da.QuestionTableSelectItemsForPostCenterResult, uid uint64) pcQuestion {
	d := pcQuestion{QuestionTableSelectItemsForPostCenterResult: *p}
	d.URL = appURL.Get().Question(p.ID)
	d.EID = fmtx.EncodeID(uid)
	return d
}

func myQuestions(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	page := validator.GetPageParamFromDict(params)
	pageSize := validator.MustGetIntFromDict(params, defs.Shared.KeyPageSize)
	sortBy := validator.MustGetStringFromDict(params, "sort", defs.Shared.MaxGenericStringLen)
	desc := validator.MustGetIntFromDict(params, "desc") != 0

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
