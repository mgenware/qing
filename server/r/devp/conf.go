/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devp

import (
	"encoding/json"
	"net/http"
	"os"
	"qing/a/app"
	"qing/a/appConf"
	"qing/a/def/infdef"
	"qing/a/handler"
)

var confRouter = handler.NewJSONRouter()

func init() {
	confRouter.Post("/get-configs", getConfigsHandler)
}

type getConfigsResult struct {
	Loaded string `json:"loaded,omitempty"`
	Disk   string `json:"disk,omitempty"`
}

func getConfigsHandler(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)

	current, err := json.Marshal(appConf.Get())
	app.PanicOn(err)

	disk, err := os.ReadFile(infdef.ConfigFile)
	app.PanicOn(err)

	res := getConfigsResult{Loaded: string(current), Disk: string(disk)}
	return resp.MustComplete(res)
}
