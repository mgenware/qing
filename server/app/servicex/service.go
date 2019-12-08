package servicex

import (
	"path"
	"qing/app/cfg"
	"qing/app/defs"
	"qing/app/extern"
	"qing/app/logx"
	"qing/app/servicex/captchax"
	"qing/fx/avatar"
	"qing/fx/imgx"
	"qing/fx/sanitizer"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Avatar    *avatar.Service
	Sanitizer *sanitizer.Sanitizer
	Captcha   *captchax.CaptchaService
	Imgx      *imgx.Imgx
}

// MustNewService creates a new Service object.
func MustNewService(config *cfg.Config, extern *extern.Extern, logger *logx.Logger) *Service {
	s := &Service{}
	s.Sanitizer = sanitizer.NewSanitizer()
	s.Captcha = captchax.NewCaptchaService(extern.RedisConn)
	s.Imgx = mustSetupImgx(config, logger)
	s.Avatar = mustSetupAvatarService(config, logger, s.Imgx)
	return s
}

func mustSetupImgx(config *cfg.Config, logger *logx.Logger) *imgx.Imgx {
	imgx, err := imgx.NewImgx(config.Extern.ImgxCmd, logger)
	if err != nil {
		panic(err)
	}
	return imgx
}

func mustSetupAvatarService(config *cfg.Config, logger *logx.Logger, imaging *imgx.Imgx) *avatar.Service {
	avatarService, err := avatar.NewService(path.Join(config.ResServer.Dir, defs.AvatarResKey), imaging, logger)
	if err != nil {
		panic(err)
	}
	return avatarService
}
