/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package servicex

import (
	"qing/a/appcm"
	"qing/a/cfgx"
	"qing/a/coretype"
	"qing/a/def"
	"qing/a/ratelmt"
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
	RateLmt             *ratelmt.RateLmt
}

func MustNewService(cc *cfgx.CoreConfig, logger coretype.CoreLogger, msConn coretype.CoreMemoryStoreConn) *Service {
	s := &Service{}

	s.Sanitizer = htmllib.NewSanitizer()
	s.HashingAlg = hashingalg.NewHashingAlg(cc)
	s.RegEmailVerificator = emailveri.NewEmailVerificator(msConn, def.MSRegEmailPrefix, def.MSRegEmailExpiry)

	s.Mail = mailx.NewMailService(cc)
	s.Noti = notix.NewNotiService(s.Mail)

	lmt, err := ratelmt.NewRateLmt(msConn)
	appcm.PanicOn(err)
	s.RateLmt = lmt
	return s
}
