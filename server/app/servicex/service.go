/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package servicex

import (
	"path"
	"qing/app"
	"qing/app/config"
	"qing/app/defs"
	"qing/app/logx"
	"qing/app/servicex/captchax"
	"qing/app/servicex/emailver"
	hashingalg "qing/app/servicex/hashingAlg"
	"qing/fx/avatar"
	"qing/fx/imgx"
	"qing/fx/sanitizer"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Avatar              *avatar.Service
	Sanitizer           *sanitizer.Sanitizer
	Captcha             *captchax.CaptchaService
	Imgx                *imgx.Imgx
	HashingAlg          *hashingalg.HashingAlg
	RegEmailVerificator *emailver.EmailVerificator
}

// MustNewService creates a new Service object.
func MustNewService(conf *config.Config, appProfile *config.AppProfile, logger *logx.Logger, conn *app.CoreMemoryStoreConn) *Service {
	s := &Service{}
	s.Sanitizer = sanitizer.NewSanitizer()
	s.Captcha = captchax.NewCaptchaService(extern.RedisConn)
	s.Imgx = mustSetupImgx(config, logger)
	s.Avatar = mustSetupAvatarService(config, logger, s.Imgx)
	s.HashingAlg = hashingalg.NewHashingAlg(appProfile)
	s.RegEmailVerificator = emailver.NewEmailVerificator(conn, defs.MSRegEmailPrefix, defs.MSRegEmailTimeout)
	return s
}

func mustSetupImgx(conf *config.Config, logger *logx.Logger) *imgx.Imgx {
	imgx, err := imgx.NewImgx(config.Extern.ImgxCmd, logger)
	if err != nil {
		panic(err)
	}
	return imgx
}

func mustSetupAvatarService(conf *config.Config, logger *logx.Logger, imaging *imgx.Imgx) *avatar.Service {
	avatarService, err := avatar.NewService(path.Join(config.ResServer.Dir, defs.AvatarResKey), imaging, logger)
	if err != nil {
		panic(err)
	}
	return avatarService
}
