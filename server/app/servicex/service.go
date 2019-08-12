package servicex

import (
	"path"
	"qing/app/cfg"
	"qing/app/defs"
	"qing/app/extern"
	"qing/app/logx"
	"qing/app/servicex/captchax"
	"qing/fx/avatar"
	"qing/fx/sanitizer"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Avatar    *avatar.Service
	Sanitizer *sanitizer.Sanitizer
	Captcha   *captchax.CaptchaService
}

// MustNewService creates a new Service object.
func MustNewService(config *cfg.Config, extern *extern.Extern, logger *logx.Logger) *Service {
	s := &Service{}
	s.Avatar = mustSetupAvatarService(config, logger)
	s.Sanitizer = sanitizer.NewSanitizer()
	s.Captcha = captchax.NewCaptchaService(extern.RedisConn)
	return s
}

func mustSetupAvatarService(config *cfg.Config, logger *logx.Logger) *avatar.Service {
	avatarService, err := avatar.NewService(path.Join(config.ResServer.Dir, defs.AvatarResKey), config.Extern.ConvertCmd, logger)
	if err != nil {
		panic(err)
	}
	return avatarService
}
