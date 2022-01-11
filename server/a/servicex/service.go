/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package servicex

import (
	"qing/a/config"
	"qing/a/defs"
	"qing/a/profile"
	"qing/a/servicex/captchax"
	"qing/a/servicex/emailver"
	hashingalg "qing/a/servicex/hashingAlg"
	"qing/app"
	"qing/fx/sanitizer"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Sanitizer           *sanitizer.Sanitizer
	Captcha             *captchax.CaptchaService
	HashingAlg          *hashingalg.HashingAlg
	RegEmailVerificator *emailver.EmailVerificator
}

// MustNewService creates a new Service object.
func MustNewService(conf *config.Config, appProfile *profile.AppProfile, logger app.CoreLogger, msConn app.CoreMemoryStoreConn) *Service {
	s := &Service{}
	s.Sanitizer = sanitizer.NewSanitizer()
	s.Captcha = captchax.NewCaptchaService(msConn)
	s.HashingAlg = hashingalg.NewHashingAlg(appProfile)
	s.RegEmailVerificator = emailver.NewEmailVerificator(msConn, defs.MSRegEmailPrefix, defs.MSRegEmailTimeout)
	return s
}