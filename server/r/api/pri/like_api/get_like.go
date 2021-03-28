/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package likeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/handler"
	"qing/lib/validator"
)

func getLike(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)
	uid := resp.UserID()

	category := validator.MustGetIntFromDict(params, "type")
	id := validator.MustGetIDFromDict(params, "id")
	dbSrc := dbSources[category]

	if dbSrc == nil {
		panic(fmt.Sprintf("Unsupported type %v", category))
	}

	hasLiked, err := dbSrc.HasLiked(app.DB, id, uid)
	app.PanicIfErr(err)

	return resp.MustComplete(hasLiked)
}
