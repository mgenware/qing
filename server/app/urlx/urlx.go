package urlx

import (
	"qing/app/cfg"
	"qing/app/defs"
	"qing/fx/avatar"
	"qing/lib/validator"
)

type URL struct {
	config *cfg.Config
}

func NewURL(cfg *cfg.Config) *URL {
	return &URL{config: cfg}
}

func (u *URL) AssetURL(url string) string {
	return u.config.HTTP.Static.URL + url
}

func (u *URL) ResURL(url string) string {
	return u.config.ResServer.URL + url
}

func (u *URL) UserIconURL50(uid uint64, avatarName string) string {
	if avatarName == "" {
		return u.AssetURL("/img/main/defavatar_50.png")
	}
	return u.ResURL(avatar.GetAvatarURL(defs.AvatarResKey, uid, avatar.AvatarSize50, avatarName))
}

func (u *URL) UserIconURL250(uid uint64, avatarName string) string {
	if avatarName == "" {
		return u.AssetURL("/img/main/defavatar.png")
	}
	return u.ResURL(avatar.GetAvatarURL(defs.AvatarResKey, uid, avatar.AvatarSize250, avatarName))
}

func (u *URL) UserIconURL(uid uint64, avatarName string, size int) string {
	if avatarName == "" {
		return u.AssetURL("/img/main/defavatar.png")
	}
	return u.ResURL(avatar.GetAvatarURL(defs.AvatarResKey, uid, size, avatarName))
}

func (u *URL) UserProfile(uid uint64) string {
	return "/" + defs.RouteUser + "/" + validator.EncodeID(uid)
}

func (u *URL) UserProfileFormatter(uid uint64) string {
	head := u.UserProfile(uid)
	return head + "?page=%v"
}

func (u *URL) Post(pid uint64) string {
	return "/" + defs.RoutePost + "/" + validator.EncodeID(pid)
}

func (u *URL) SignIn() string {
	return "/" + defs.RouteAuth + "/sign/in"
}
