/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package def

import "time"

type ContextKey string

const (
	AvatarResKey = "avatars"
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

	MSRegEmailExpiry time.Duration = 60 * 60 * time.Second
	// K: Secret ID sent to user email, V: user pwd.
	MSRegEmailPrefix = "reg-email"

	// Limit posting rate per second.
	MSRateLimitPostCorePerSecKey = "rl-pc:%v"
	MSRateLimitSignUpPerMinKey   = "rl-su:%v"
)

const (
	MSDefaultExpiry      time.Duration = 2592000 * time.Second
	CookiesDefaultExpiry time.Duration = 2592000 * time.Second
)
