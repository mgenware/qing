package urlx

import (
	"fmt"
	"net/url"
	"qing/app/cfg"
	"qing/app/defs"
	"qing/fx/avatar"
	"qing/lib/validator"
	"strconv"
)

// URL helps generate common URLs.
type URL struct {
	config *cfg.Config
}

// NewURL creates a new URL.
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

func (u *URL) UserProfileAdv(uid uint64, tab string, page int) string {
	s := "/" + defs.Constants.RouteUser + "/" + validator.EncodeID(uid)
	qs := url.Values{}
	if page > 1 {
		qs.Set(defs.Constants.KeyPage, strconv.Itoa(page))
	}
	if tab != "" {
		qs.Set(defs.Constants.KeyTab, tab)
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) HomeAdv(tab string, page int) string {
	s := "/"
	qs := url.Values{}
	if page > 1 {
		qs.Set(defs.Constants.KeyPage, strconv.Itoa(page))
	}
	if tab != "" {
		qs.Set(defs.Constants.KeyTab, tab)
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) UserProfile(uid uint64) string {
	return u.UserProfileAdv(uid, "", 1)
}

func (u *URL) Post(pid uint64) string {
	return "/" + defs.Constants.RoutePost + "/" + validator.EncodeID(pid)
}

func (u *URL) DiscussionWithPage(pid uint64, page int) string {
	s := "/" + defs.Constants.RouteDiscussion + "/" + validator.EncodeID(pid)
	if page > 1 {
		s += fmt.Sprintf("&%v=%v", defs.Constants.KeyPage, page)
	}
	return s
}

func (u *URL) Discussion(pid uint64) string {
	return u.DiscussionWithPage(pid, 1)
}

func (u *URL) QuestionWithPage(pid uint64, page int) string {
	s := "/" + defs.Constants.RouteQuestion + "/" + validator.EncodeID(pid)
	if page > 1 {
		s += fmt.Sprintf("&%v=%v", defs.Constants.KeyPage, page)
	}
	return s
}

func (u *URL) Question(pid uint64) string {
	return u.QuestionWithPage(pid, 1)
}

func (u *URL) SignIn() string {
	return "/" + defs.Constants.RouteAuth + "/sign/in"
}

func (u *URL) RegEmailVerification(publicID string) string {
	return "/" + defs.Constants.RouteAuth + "/verify-reg-email/" + url.PathEscape(publicID)
}

func (u *URL) ForumAdv(fid uint64, tab string, page int) string {
	s := "/" + defs.Constants.RouteForum + "/" + validator.EncodeID(fid)
	qs := url.Values{}
	if page > 1 {
		qs.Set(defs.Constants.KeyPage, strconv.Itoa(page))
	}
	if tab != "" {
		qs.Set(defs.Constants.KeyTab, tab)
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) ForumGroup(id uint64) string {
	return "/" + defs.Constants.RouteForumGroup + "/" + validator.EncodeID(id)
}
