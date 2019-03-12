package svc

import (
	"path"
	"qing/app/config"
	"qing/app/defs"
	"qing/app/logx"
	"qing/fx/avatar"
)

type Service struct {
	Avatar *avatar.Service
}

func MustNewService(config *config.Config, logger *logx.Logger) *Service {
	s := &Service{}
	s.Avatar = mustSetupAvatarService(config, logger)
	return s
}

func mustSetupAvatarService(config *config.Config, logger *logx.Logger) *avatar.Service {
	avatarService, err := avatar.NewService(path.Join(config.ResServer.Dir, defs.AvatarResKey), logger)
	if err != nil {
		panic(err)
	}
	return avatarService
}
