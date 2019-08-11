package servicex

import (
	"path"
	"qing/app/cfg"
	"qing/app/defs"
	"qing/app/logx"
	"qing/fx/avatar"
	"qing/fx/sanitizer"
	"qing/app/servicex/captchaSvc"
	"qing/app/extern"
)

// Service contains components for curtain independent tasks.
type Service struct {
	Avatar    *avatar.Service
	Sanitizer *sanitizer.Sanitizer
	Captcha *captchaSvc.CaptchaService
}

// MustNewService creates a new Service object.
func MustNewService(config *cfg.Config, extern *extern.Extern, logger *logx.Logger) *Service {
	s := &Service{}
	s.Avatar = mustSetupAvatarService(config, logger)
	s.Sanitizer = sanitizer.NewSanitizer()
	s.Captcha = captchaSvc.NewCaptchaService(extern.RedisConn)
	return s
}

func mustSetupAvatarService(config *cfg.Config, logger *logx.Logger) *avatar.Service {
	avatarService, err := avatar.NewService(path.Join(config.ResServer.Dir, defs.AvatarResKey), config.Extern.ConvertCmd, logger)
	if err != nil {
		panic(err)
	}
	return avatarService
}
