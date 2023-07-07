/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package urlx

import (
	"net/url"
	"qing/a/cfgx"
	"qing/a/def"
	"qing/a/def/appDef"
	"qing/lib/clib"
	"qing/s/avatar"
	"strconv"
)

const userSvg = "/img/main/user-static.svg"

// URL helps generate common URLs.
type URL struct {
	cfg *cfgx.CoreConfig
}

// NewURL creates a new URL.
func NewURL(cfg *cfgx.CoreConfig) *URL {
	return &URL{cfg: cfg}
}

func (u *URL) AssetURL(url string) string {
	return u.cfg.HTTP.Static.URL + url
}

func (u *URL) ResURL(url string) string {
	return u.cfg.ResServer.URL + url
}

func (u *URL) UserIconURL50(uid uint64, iconName string) string {
	if iconName == "" {
		return u.AssetURL(userSvg)
	}
	return u.ResURL(avatar.GetAvatarURL(def.AvatarResKey, uid, avatar.AvatarSize50, iconName))
}

func (u *URL) UserIconURL250(uid uint64, iconName string) string {
	if iconName == "" {
		return u.AssetURL(userSvg)
	}
	return u.ResURL(avatar.GetAvatarURL(def.AvatarResKey, uid, avatar.AvatarSize250, iconName))
}

func (u *URL) UserIconURL(uid uint64, iconName string, size int) string {
	if iconName == "" {
		return u.AssetURL(userSvg)
	}
	return u.ResURL(avatar.GetAvatarURL(def.AvatarResKey, uid, size, iconName))
}

func (u *URL) UserProfileAdv(uid uint64, tab string, page int) string {
	s := "/" + appDef.RouteUser + "/" + clib.EncodeID(uid)
	qs := url.Values{}
	if page > 1 {
		qs.Set(appDef.KeyPage, strconv.Itoa(page))
	}
	if tab != "" {
		qs.Set(appDef.KeyTab, tab)
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) HomeAdv(page int) string {
	s := "/"
	qs := url.Values{}
	if page > 1 {
		qs.Set(appDef.KeyPage, strconv.Itoa(page))
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
	return "/" + appDef.RoutePost + "/" + clib.EncodeID(pid)
}

func (u *URL) PostAdv(pid uint64, cmtID uint64) string {
	s := u.Post(pid)
	qs := url.Values{}
	if cmtID > 0 {
		qs.Set(appDef.KeyCmt, clib.EncodeID(cmtID))
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) FPost(pid uint64) string {
	return "/" + appDef.RouteForumPost + "/" + clib.EncodeID(pid)
}

func (u *URL) FPostAdv(pid uint64, cmtID uint64) string {
	s := u.FPost(pid)
	qs := url.Values{}
	if cmtID > 0 {
		qs.Set(appDef.KeyCmt, clib.EncodeID(cmtID))
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) SignIn() string {
	return "/" + appDef.RouteAuth + "/sign/in"
}

func (u *URL) VerifyRegEmail(siteURL, publicID string) string {
	return siteURL + "/" + appDef.RouteAuth + "/verify-reg-email/" + url.PathEscape(publicID)
}

func (u *URL) VerifyResetPwd(siteURL, publicID string) string {
	return siteURL + "/" + appDef.RouteAuth + "/reset-pwd/" + url.PathEscape(publicID)
}

func (u *URL) ForumAdv(fid uint64, page int) string {
	s := "/" + appDef.RouteForum + "/" + clib.EncodeID(fid)
	qs := url.Values{}
	if page > 1 {
		qs.Set(appDef.KeyPage, strconv.Itoa(page))
	}

	if len(qs) > 0 {
		return s + "?" + qs.Encode()
	}
	return s
}

func (u *URL) ForumSettings(fid uint64) string {
	return "/" + appDef.RouteForum + "/" + clib.EncodeID(fid) + "/settings"
}

func (u *URL) ForumGroup(id uint64) string {
	return "/" + appDef.RouteForumGroup + "/" + clib.EncodeID(id)
}
