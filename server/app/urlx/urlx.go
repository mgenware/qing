package urlx

import (
	"qing/app/cfg"
	"qing/app/defs"
	"qing/fx/avatar"
	"strconv"
)

type URL struct {
	config *cfg.Config
}

func NewURL(cfg *cfg.Config) *URL {
	return &URL{config: cfg}
}

func (u *URL) EncodeID(id uint64) string {
	return strconv.FormatUint(id, 36)
}

func (u *URL) DecodeID(str string) (uint64, error) {
	return strconv.ParseUint(str, 36, 64)
}

func (u *URL) AssetURL(url string) string {
	return u.config.HTTP.Static.URL + url
}

func (u *URL) ResURL(url string) string {
	return u.config.ResServer.URL + url
}

func (u *URL) UserAvatarURL50(uid uint64, avatarName string) string {
	if avatarName == "" {
		return u.AssetURL("/img/main/defavatar_50.png")
	}
	return u.ResURL(avatar.GetAvatarURL(defs.AvatarResKey, uid, avatar.AvatarSize50, avatarName))
}

func (u *URL) UserAvatarURL250(uid uint64, avatarName string) string {
	if avatarName == "" {
		return u.AssetURL("/img/main/defavatar.png")
	}
	return u.ResURL(avatar.GetAvatarURL(defs.AvatarResKey, uid, avatar.AvatarSize250, avatarName))
}

func (u *URL) UserAvatarURL(uid uint64, avatarName string, size int) string {
	if avatarName == "" {
		return u.AssetURL("/img/main/defavatar.png")
	}
	return u.ResURL(avatar.GetAvatarURL(defs.AvatarResKey, uid, size, avatarName))
}

func (u *URL) UserProfile(uid uint64) string {
	return "/" + defs.RouteUser + "/" + u.EncodeID(uid)
}

func (u *URL) UserProfileFormatter(uid uint64) string {
	head := u.UserProfile(uid)
	return head + "?page=%v"
}

func (u *URL) Post(pid uint64) string {
	return "/" + defs.RoutePost + "/" + u.EncodeID(pid)
}

func (u *URL) SignIn() string {
	return "/" + defs.RouteAuth + "/sign_in"
}
