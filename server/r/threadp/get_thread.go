/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package threadp

import (
	"net/http"
	"qing/a/handler"
	"qing/r/postp"
)

const threadEntryScriptName = "thread/threadEntry"
const defaultPageSize = 10

func GetThread(w http.ResponseWriter, r *http.Request) handler.HTML {
	return postp.GetPostCore(w, r, true)
}
