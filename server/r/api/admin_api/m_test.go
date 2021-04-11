/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package adminapi

import (
	"os"
	"qing/st"
	"testing"
)

func TestMain(m *testing.M) {
	st.LoginAdmin()
	r := m.Run()
	st.LogoutAdmin()
	os.Exit(r)
}
