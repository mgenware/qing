/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import (
	"qing/a/cfgx"
	"qing/a/def/frozenDef"
)

type AppConfigAccessor struct {
	cfg *cfgx.AppConfig
}

func NewAppConfigAccessor(cfg *cfgx.AppConfig) *AppConfigAccessor {
	return &AppConfigAccessor{cfg: cfg}
}

func (a *AppConfigAccessor) ContentInputType() frozenDef.ContentInputTypeConfig {
	return a.cfg.Content.InputType()
}

func (a *AppConfigAccessor) PostPermission() frozenDef.PostPermissionConfig {
	return a.cfg.Permissions.Post()
}

func (a *AppConfigAccessor) NotiMailAccount() string {
	return a.cfg.Mail.NoReplyAccount.Email
}

func (a *AppConfigAccessor) NotiMailUserName() string {
	return a.cfg.Mail.NoReplyAccount.UserName
}

func (a *AppConfigAccessor) NotiMailPassword() string {
	return a.cfg.Mail.NoReplyAccount.Pwd
}

func (a *AppConfigAccessor) NotiMailDisplayName() string {
	return a.cfg.Mail.NoReplyAccount.DisplayName
}

func (a *AppConfigAccessor) NotiMailSmtpHost() string {
	return a.cfg.Mail.SMTP.Host
}

func (a *AppConfigAccessor) NotiMailSmtpPort() int {
	return a.cfg.Mail.SMTP.Port
}

func (a *AppConfigAccessor) NotiMailSmtpUseTLS() bool {
	return a.cfg.Mail.SMTP.SSL
}

func (a *AppConfigAccessor) ForumEnabled() bool {
	fc := a.cfg.Forum
	if fc == nil {
		return false
	}
	return fc.Enabled
}
