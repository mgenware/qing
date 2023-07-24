/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fpostp

import (
	"net/http"
	"qing/a/handler"
	"qing/r/postp"
)

func FPostPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	return postp.PostPageCore(w, r, true)
}
