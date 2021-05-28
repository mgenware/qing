/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package urlx

import (
	"fmt"
	"net/url"
	"qing/app/config"
	"qing/app/defs"
	"qing/fx/avatar"
	"qing/lib/fmtx"
	"strconv"
)

// URL helps generate common URLs.
type URL struct {
	conf *config.Config
}

// NewURL creates a new URL.
func NewURL(conf *config.Config) *URL {
	return &URL{conf: conf}
}

func (u *URL) AssetURL(url string) string {
	return u.conf.HTTP.Static.URL + url
}

func (u *URL) ResURL(url string) string {
	return u.conf.ResServer.URL + url
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
	s := "/" + defs.Shared.RouteUser + "/" + fmtx.EncodeID(uid)
	qs := url.Values{}
	if page > 1 {
		qs.Set(defs.Shared.KeyPage, strconv.Itoa(page))
	}
	if tab != "" {
		qs.Set(defs.Shared.KeyTab, tab)
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
		qs.Set(defs.Shared.KeyPage, strconv.Itoa(page))
	}
	if tab != "" {
		qs.Set(defs.Shared.KeyTab, tab)
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
	return "/" + defs.Shared.RoutePost + "/" + fmtx.EncodeID(pid)
}

func (u *URL) DiscussionWithPage(pid uint64, page int) string {
	s := "/" + defs.Shared.RouteDiscussion + "/" + fmtx.EncodeID(pid)
	if page > 1 {
		s += fmt.Sprintf("&%v=%v", defs.Shared.KeyPage, page)
	}
	return s
}

func (u *URL) Discussion(pid uint64) string {
	return u.DiscussionWithPage(pid, 1)
}

func (u *URL) QuestionWithPage(pid uint64, page int) string {
	s := "/" + defs.Shared.RouteQuestion + "/" + fmtx.EncodeID(pid)
	if page > 1 {
		s += fmt.Sprintf("&%v=%v", defs.Shared.KeyPage, page)
	}
	return s
}

func (u *URL) Question(pid uint64) string {
	return u.QuestionWithPage(pid, 1)
}

func (u *URL) SignIn() string {
	return "/" + defs.Shared.RouteAuth + "/sign/in"
}

func (u *URL) RegEmailVerification(publicID string) string {
	return "/" + defs.Shared.RouteAuth + "/verify-reg-email/" + url.PathEscape(publicID)
}

func (u *URL) ForumAdv(fid uint64, tab string, page int) string {
	s := "/" + defs.Shared.RouteForum + "/" + fmtx.EncodeID(fid)
	qs := url.Values{}
	if page > 1 {
		qs.Set(defs.Shared.KeyPage, strconv.Itoa(page))
	}
	if tab != "" {
		qs.Set(defs.Shared.KeyTab, tab)
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) ForumSettings(fid uint64) string {
	return "/" + defs.Shared.RouteForum + "/" + fmtx.EncodeID(fid) + "/settings"
}

func (u *URL) ForumGroup(id uint64) string {
	return "/" + defs.Shared.RouteForumGroup + "/" + fmtx.EncodeID(id)
}
