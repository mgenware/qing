package svc

import (
	"path"
	"qing/app/cfg"
	"qing/app/defs"
	"qing/app/logx"
	"qing/fx/avatar"
)

type Service struct {
	Avatar *avatar.Service
}

func MustNewService(config *cfg.Config, logger *logx.Logger) *Service {
	s := &Service{}
	s.Avatar = mustSetupAvatarService(config, logger)
	return s
}

func mustSetupAvatarService(config *cfg.Config, logger *logx.Logger) *avatar.Service {
	avatarService, err := avatar.NewService(path.Join(config.ResServer.Dir, defs.AvatarResKey), config.Extern.ConvertCmd, logger)
	if err != nil {
		panic(err)
	}
	return avatarService
}
