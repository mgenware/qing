/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import "qing/a/def/frozenDef"

type AppConfigAccessorBase interface {
	ContentInputType() frozenDef.ContentInputTypeConfig
	PostPermission() frozenDef.PostPermissionConfig
	NotiMailAccount() string
	NotiMailUserName() string
	NotiMailPassword() string
	NotiMailDisplayName() string
	NotiMailSmtpHost() string
	NotiMailSmtpPort() int
	NotiMailSmtpUseTLS() bool
	ForumEnabled() bool
}
