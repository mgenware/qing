/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package postp

import (
	"net/http"
	"qing/app/appDB"
	"qing/da"
	"qing/lib/fmtx"
	"qing/st"
	"testing"
)

var title = "TITLE"
var content = "CONTENT"

func TestGetPost(t *testing.T) {
	db := appDB.DB()
	id, err := da.Post.InsertItem(db, title, content, st.UserID, st.Date, st.Date, 0, 0)
	st.PanicIfErr(err)

	eid := fmtx.EncodeID(id)
	rr := st.HTTPGetRecorder("/p/{pid}", "/p/"+eid, GetPost)
	st.AssertEqual(t, rr.Code, http.StatusOK)
	st.AssertEqual(t, rr.Body.String(), "Title:TITLE - ls._siteNameScripts:<script.postEntry>\nAppWindDataString:{\\\"EID\\\":\\\""+eid+"\\\",\\\"CmtCount\\\":0,\\\"InitialLikes\\\":0}\nContentHTML:<container-view>\n  <h2>\n    <a href=\"/p/"+eid+"\">TITLE</a>\n  </h2>\n  <div class=\"m-t-md row\">\n  <div class=\"col-auto\">\n    <a href=\"/user/2t\">\n      <img src=\"/res/user_icon/101/50_ut.png\" class=\"avatar-m\" width=\"50\" height=\"50\" />\n    </a>\n  </div>\n  <div class=\"col\">\n    <div><a href=\"/user/2t\">UT</a></div>\n    <p>\n      <!-- prettier-ignore -->\n      <time-field>1990-10-27T10:11:12Z|1990-10-27T10:11:12Z</time-field>\n      <!-- `id` format should be in sync with `editBarApp.ts`: `editBarID` -->\n      <edit-bar-app\n        class=\"m-l-md\"\n        id=\"edit-bar-1-"+eid+"\"\n        uid=\"2t\"\n        hasLeftMargin\n      ></edit-bar-app>\n    </p>\n  </div>\n</div>\n\n  <hr />\n  <div>CONTENT</div>\n\n  <div class=\"m-t-lg\">\n    <post-payload-app></post-payload-app>\n  </div>\n</container-view>\n\n")

	// Clean up.
	st.PanicIfErr(da.Post.DeleteItem(db, id, st.UserID))
}
