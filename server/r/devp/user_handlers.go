/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"net/http"

	"qing/app"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/handler"
	"qing/da"
	"qing/lib/fmtx"

	"github.com/go-chi/chi"
)

func userPostCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid, err := fmtx.DecodeID(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)
	c, err := da.UserStats.TestSelectPostCount(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustComplete(c)
}

func userDiscussionCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid, err := fmtx.DecodeID(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)
	c, err := da.UserStats.TestSelectDiscussionCount(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustComplete(c)
}

func userQuestionCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid, err := fmtx.DecodeID(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)
	c, err := da.UserStats.TestSelectQuestionCount(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustComplete(c)
}

func userAnswerCount(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := appHandler.JSONResponse(w, r)
	uid, err := fmtx.DecodeID(chi.URLParam(r, "uid"))
	app.PanicIfErr(err)
	c, err := da.UserStats.TestSelectAnswerCount(appDB.DB(), uid)
	app.PanicIfErr(err)
	return resp.MustComplete(c)
}
