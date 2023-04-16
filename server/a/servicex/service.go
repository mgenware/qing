/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package servicex

import (
	"qing/a/conf"
	"qing/a/coretype"
	"qing/a/def"
	"qing/a/profile"
	"qing/a/servicex/emailveri"
	hashingalg "qing/a/servicex/hashingAlg"
	"qing/a/servicex/mailx"
	"qing/a/servicex/notix"
	"qing/lib/htmllib"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Sanitizer           *htmllib.Sanitizer
	HashingAlg          *hashingalg.HashingAlg
	RegEmailVerificator *emailveri.EmailVerificator
	Mail                *mailx.MailService
	Noti                *notix.Service
}

// MustNewService creates a new Service object.
func MustNewService(config *conf.Config, appProfile *profile.AppProfile, logger coretype.CoreLogger, msConn coretype.CoreMemoryStoreConn) *Service {
	s := &Service{}

	s.Sanitizer = htmllib.NewSanitizer()
	s.HashingAlg = hashingalg.NewHashingAlg(appProfile)
	s.RegEmailVerificator = emailveri.NewEmailVerificator(msConn, def.MSRegEmailPrefix, def.MSRegEmailExpiry)

	s.Mail = mailx.NewMailService(config)
	s.Noti = notix.NewNotiService(s.Mail)
	return s
}
