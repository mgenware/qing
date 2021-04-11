/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"log"
	"net/http"
	"qing/st"
	"testing"
)

func TestGetAdmins_Visitor(t *testing.T) {
	rr := st.HTTPRecorderFromRouter(Router.Core, "/get-admin", true)
	st.AssertEqual(t, rr.Code, http.StatusOK)
	log.Print(rr.Body.String())
	// st.Assert(t, strings.Contains(rr.Body.String(), `{"eid":"2t","name":"UT","url":"/user/2t","iconURL":"/res/user_icon/101/50_ut.png"}`))
}

func TestGetAdmins_Admin(t *testing.T) {
	rr := st.HTTPRecorderFromRouter(Router.Core, "/get-admin", true)
	st.AssertEqual(t, rr.Code, http.StatusOK)
	log.Print(rr.Body.String())
	// st.Assert(t, strings.Contains(rr.Body.String(), `{"eid":"2t","name":"UT","url":"/user/2t","iconURL":"/res/user_icon/101/50_ut.png"}`))
}
