/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package defs

type ContextKey string

const (
	AvatarResKey = "user_icon"
)

// Cookie keys
const (
	SessionCookieKey = "_ut"
)

// Context keys
const (
	LanguageContextKey ContextKey = "lang"
	DictContextKey     ContextKey = "dict"
	SIDContextKey      ContextKey = "sid"
	UserContextKey     ContextKey = "user"

	ForumIDContextKey      ContextKey = "forum_id"
	ForumGroupIDContextKey ContextKey = "forum_group_id"
)

// MS(memory storage, e.g. redis) keys.
const (
	// K: sid, V: session user json value.
	MSSIDToUser = "auth-ss:%v"
	// K: user id, V: sid
	MSUserIDToSID = "auth-us:%v"
	// K: cap:<user id>:<type> V: captcha value.
	MSCaptcha        = "captcha:%v:%v"
	MSCaptchaTimeout = 3 * 60

	MSRegEmailTimeout = 60 * 60
	// K: Secret ID sent to user email, V: user pwd.
	MSRegEmailPrefix = "reg-email"

	MSLimitPosting        = "lim-pos:%v:%v"
	MSLimitPostingTimeout = 59
)

const (
	Timespan30DaysInSecs = 2592000
)
