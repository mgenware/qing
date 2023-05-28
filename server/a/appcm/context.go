/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appcm

import (
	"context"
	"qing/a/def"
)

// ContextLanguage returns context localization language ID from the given request.
func ContextLanguage(ctx context.Context) string {
	result, _ := ctx.Value(def.LanguageContextKey).(string)
	return result
}

// ContextSID returns context SID from the given request.
func ContextSID(ctx context.Context) string {
	result, _ := ctx.Value(def.SIDContextKey).(string)
	return result
}

// ContextUser returns context user from the given request.
func ContextUser(ctx context.Context) *SessionUser {
	result, _ := ctx.Value(def.UserContextKey).(*SessionUser)
	return result
}

// ContextUserID returns context user ID from the given request.
func ContextUserID(ctx context.Context) uint64 {
	user := ContextUser(ctx)
	if user != nil {
		return user.ID
	}
	return 0
}

// ContextDict returns context dict from the given request.
func ContextDict(ctx context.Context) map[string]any {
	result, _ := ctx.Value(def.DictContextKey).(map[string]any)
	return result
}

// ContextForumID returns context forum ID from the given request.
func ContextForumID(ctx context.Context) uint64 {
	result, _ := ctx.Value(def.ForumIDContextKey).(uint64)
	return result
}

// ContextForumGroupID returns context forum group ID from the given request.
func ContextForumGroupID(ctx context.Context) uint64 {
	result, _ := ctx.Value(def.ForumGroupIDContextKey).(uint64)
	return result
}
