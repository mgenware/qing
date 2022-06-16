/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package servicex

import (
	"qing/a/app"
	"qing/a/config"
	"qing/a/def"
	"qing/a/profile"
	"qing/a/servicex/emailver"
	hashingalg "qing/a/servicex/hashingAlg"
	"qing/a/servicex/mailnoti"
	"qing/lib/htmllib"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Sanitizer           *htmllib.Sanitizer
	HashingAlg          *hashingalg.HashingAlg
	RegEmailVerificator *emailver.EmailVerificator
	MailNoti            *mailnoti.MailNoti
}

// MustNewService creates a new Service object.
func MustNewService(conf *config.Config, appProfile *profile.AppProfile, logger app.CoreLogger, msConn app.CoreMemoryStoreConn) *Service {
	s := &Service{}
	debugConf := conf.Debug

	s.Sanitizer = htmllib.NewSanitizer()
	s.HashingAlg = hashingalg.NewHashingAlg(appProfile)
	s.RegEmailVerificator = emailver.NewEmailVerificator(msConn, def.MSRegEmailPrefix, def.MSRegEmailTimeout)

	var mailnotiDevDir string
	if debugConf != nil {
		mailnotiDevDir = debugConf.MailBox.Dir
	}
	s.MailNoti = mailnoti.NewMailNoti(mailnotiDevDir)
	return s
}
