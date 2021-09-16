/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package voteapi

import (
	"net/http"
	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func vote(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	id := validator.MustGetIDFromDict(params, "id")
	newValue := validator.MustGetIntFromDict(params, "value")

	db := appDB.DB()
	currentValue, err := FetchMyVote(id, uid)
	app.PanicIfErr(err)
	if currentValue == defs.Shared.NoVoteValue {
		// New vote.
		if newValue == defs.Shared.UpVoteValue {
			err = da.AnswerVote.NewUpVote(db, id, uid)
		} else if newValue == defs.Shared.DownVoteValue {
			err = da.AnswerVote.NewDownVote(db, id, uid)
		}
	} else if currentValue == newValue {
		// Retract an existing vote.
		if newValue == defs.Shared.UpVoteValue {
			err = da.AnswerVote.RetractUpVote(db, id, uid)
		} else if newValue == defs.Shared.DownVoteValue {
			err = da.AnswerVote.RetractDownVote(db, id, uid)
		}
	} else {
		// Switch an existing vote.
		if newValue == defs.Shared.UpVoteValue {
			err = da.AnswerVote.SwitchToUpVote(db, id, uid)
		} else if newValue == defs.Shared.DownVoteValue {
			err = da.AnswerVote.SwitchToDownVote(db, id, uid)
		}
	}
	app.PanicIfErr(err)
	return resp.MustComplete(nil)
}
