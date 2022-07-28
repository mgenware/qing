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
	"qing/a/servicex/emailveri"
	hashingalg "qing/a/servicex/hashingAlg"
	"qing/a/servicex/mailx"
	"qing/lib/htmllib"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Sanitizer           *htmllib.Sanitizer
	HashingAlg          *hashingalg.HashingAlg
	RegEmailVerificator *emailveri.EmailVerificator
	MailService         *mailx.MailService
}

// MustNewService creates a new Service object.
func MustNewService(conf *config.Config, appProfile *profile.AppProfile, logger app.CoreLogger, msConn app.CoreMemoryStoreConn) *Service {
	s := &Service{}
	debugConf := conf.Debug

	s.Sanitizer = htmllib.NewSanitizer()
	s.HashingAlg = hashingalg.NewHashingAlg(appProfile)
	s.RegEmailVerificator = emailveri.NewEmailVerificator(msConn, def.MSRegEmailPrefix, def.MSRegEmailExpiry)

	var mailxDevDir string
	if debugConf != nil {
		mailxDevDir = debugConf.MailBox.Dir
	}
	s.MailService = mailx.NewMailService(mailxDevDir)
	return s
}
