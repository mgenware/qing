/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import (
	"net/http"
	"qing/a/appcm"
	"qing/a/def/frozenDef"
	"qing/lib/httplib"
	"strconv"
)

type BrAppConfigAccessor struct {
	r           *http.Request
	appAccessor *AppConfigAccessor
}

func NewBrAppConfigAccessor(r *http.Request, appAccessor *AppConfigAccessor) *BrAppConfigAccessor {
	return &BrAppConfigAccessor{r: r, appAccessor: appAccessor}
}

func (a *BrAppConfigAccessor) _getString(key string) string {
	cookieKey := "__brAppConfig_" + key
	v, err := httplib.ReadCookie(a.r, cookieKey)
	appcm.PanicOn(err, "Failed to read cookie in BrAppConfigAccessor")
	return v
}

func (a *BrAppConfigAccessor) _getInt(key string) (bool, int) {
	v := a._getString(key)
	if v == "" {
		return false, 0
	}
	i, err := strconv.Atoi(v)
	appcm.PanicOn(err, "Failed to parse number in BrAppConfigAccessor")
	return true, i
}

func (a *BrAppConfigAccessor) _getBool(key string) (bool, bool) {
	v := a._getString(key)
	if v == "" {
		return false, false
	}
	b, err := strconv.ParseBool(v)
	appcm.PanicOn(err, "Failed to parse bool in BrAppConfigAccessor")
	return true, b
}

func (a *BrAppConfigAccessor) ContentInputType() frozenDef.ContentInputTypeConfig {
	v := a._getString("contentInputType")
	if v == "" {
		return a.appAccessor.ContentInputType()
	}
	return frozenDef.ContentInputTypeConfig(v)
}

func (a *BrAppConfigAccessor) PostPermission() frozenDef.PostPermissionConfig {
	v := a._getString("postPermission")
	if v == "" {
		return a.appAccessor.PostPermission()
	}
	return frozenDef.PostPermissionConfig(v)
}

func (a *BrAppConfigAccessor) NotiMailAccount() string {
	v := a._getString("notiMailAccount")
	if v == "" {
		return a.appAccessor.NotiMailAccount()
	}
	return v
}

func (a *BrAppConfigAccessor) NotiMailUserName() string {
	v := a._getString("notiMailUserName")
	if v == "" {
		return a.appAccessor.NotiMailUserName()
	}
	return v
}

func (a *BrAppConfigAccessor) NotiMailPassword() string {
	v := a._getString("notiMailPassword")
	if v == "" {
		return a.appAccessor.NotiMailPassword()
	}
	return v
}

func (a *BrAppConfigAccessor) NotiMailDisplayName() string {
	v := a._getString("notiMailDisplayName")
	if v == "" {
		return a.appAccessor.NotiMailDisplayName()
	}
	return v
}

func (a *BrAppConfigAccessor) NotiMailSmtpHost() string {
	v := a._getString("notiMailSmtpHost")
	if v == "" {
		return a.appAccessor.NotiMailSmtpHost()
	}
	return v
}

func (a *BrAppConfigAccessor) NotiMailSmtpPort() int {
	hasValue, v := a._getInt("notiMailSmtpPort")
	if !hasValue {
		return a.appAccessor.NotiMailSmtpPort()
	}
	return v
}

func (a *BrAppConfigAccessor) NotiMailSmtpUseTLS() bool {
	hasValue, v := a._getBool("notiMailSmtpUseTLS")
	if !hasValue {
		return a.appAccessor.NotiMailSmtpUseTLS()
	}
	return v
}

func (a *BrAppConfigAccessor) ForumEnabled() bool {
	hasValue, v := a._getBool("forumEnabled")
	if !hasValue {
		return a.appAccessor.ForumEnabled()
	}
	return v
}
