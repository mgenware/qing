/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package st

import "qing/app/appUserManager"

func LoginAdmin() {
	appUserManager.Get().TestLogin(AdminUserID)
}

func LogoutAdmin() {
	appUserManager.Get().TestLogout(AdminUserID)
}
