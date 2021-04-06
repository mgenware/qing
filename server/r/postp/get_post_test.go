/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"net/http"
	"qing/da"
	"qing/ut"
	"testing"

	"github.com/mgenware/go-packagex/v6/test"
)

func TestGetProfile(t *testing.T) {
	da.Post.InsertItem(appDB.)
	rr := ut.HTTPGetRecorder("/p/{pid}", "/p/2t", GetPost)
	test.Assert(t, rr.Code, http.StatusOK)
	test.Assert(t, rr.Body.String(), "lire")
}
