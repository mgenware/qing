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
	hashingalg "qing/a/servicex/hashingAlg"
	"qing/a/servicex/mailx"
	"qing/a/servicex/msveri"
	"qing/a/servicex/notix"
	"qing/lib/htmllib"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Sanitizer        *htmllib.Sanitizer
	HashingAlg       *hashingalg.HashingAlg
	RegEmailVerifier *msveri.MSVerifier
	Mail             *mailx.MailService
	Noti             *notix.Service
	RateLmt          *ratelmt.RateLmt
	ResetPwdVerifier *msveri.MSVerifier
}

func MustNewService(cc *cfgx.CoreConfig, logger coretype.CoreLogger, msConn coretype.CoreMemoryStoreConn) *Service {
	s := &Service{}

	s.Sanitizer = htmllib.NewSanitizer()
	s.HashingAlg = hashingalg.NewHashingAlg(cc)
	s.RegEmailVerifier = msveri.NewMSVerifier(msConn, def.MSRegEmailPrefix, def.MSRegEmailExpiry)
	s.ResetPwdVerifier = msveri.NewMSVerifier(msConn, def.MSResetPwdPrefix, def.MSResetPwdExpiry)

	s.Mail = mailx.NewMailService(cc)
	s.Noti = notix.NewNotiService(s.Mail)

	lmt, err := ratelmt.NewRateLmt(cc, msConn)
	appcm.PanicOn(err, "error creating rate limiter")
	s.RateLmt = lmt
	return s
}
