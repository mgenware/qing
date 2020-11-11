package urlx

import (
	"net/url"
	"qing/app/cfg"
	"qing/app/defs"
	"qing/fx/avatar"
	"qing/lib/validator"
	"strconv"
)

const defaultPageQueryString = "?page=%v"
const tabParam = "tab"

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

func (u *URL) UserProfileAdv(uid uint64, tab int, page int) string {
	s := "/" + defs.Constants.RouteUser + "/" + validator.EncodeID(uid)
	qs := url.Values{}
	if page > 1 {
		qs.Set("page", strconv.Itoa(page))
	}
	switch tab {
	case defs.Constants.EntityPost:
		qs.Set(tabParam, defs.Constants.ProfileTabPosts)
		break
	case defs.Constants.EntityThread:
		qs.Set(tabParam, defs.Constants.ProfileTabThreads)
		break
	case defs.Constants.EntityAnswer:
		qs.Set(tabParam, defs.Constants.ProfileTabAnswers)
		break
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) UserProfile(uid uint64) string {
	return u.UserProfileAdv(uid, 0, 1)
}

func (u *URL) Post(pid uint64) string {
	return "/" + defs.Constants.RoutePost + "/" + validator.EncodeID(pid)
}

func (u *URL) ThreadWithPage(pid uint64, page int) string {
	s := "/" + defs.Constants.RouteThread + "/" + validator.EncodeID(pid)
	if page > 1 {
		s += defaultPageQueryString
	}
	return s
}

func (u *URL) Thread(pid uint64) string {
	return u.ThreadWithPage(pid, 1)
}

func (u *URL) SignIn() string {
	return "/" + defs.Constants.RouteAuth + "/sign/in"
}

func (u *URL) RegEmailVerification(publicID string) string {
	return "/" + defs.Constants.RouteAuth + "/verify-reg-email/" + url.PathEscape(publicID)
}
