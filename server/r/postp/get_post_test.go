/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"net/http"
	"qing/app/appDB"
	"qing/da"
	"qing/lib/validator"
	"qing/st"
	"testing"
)

var title = "TITLE"
var content = "CONTENT"

func TestGetProfile(t *testing.T) {
	id, err := da.Post.InsertItem(appDB.DB(), title, content, st.UserID, 0, 0)
	st.PanicIfErr(err)

	eid := validator.EncodeID(id)
	rr := st.HTTPGetRecorder("/p/{pid}", "/p/"+eid, GetPost)
	st.Assert(t, rr.Code, http.StatusOK)
	st.Assert(t, rr.Body.String(), "lire")
}
