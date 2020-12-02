package appcom

import (
	"context"
	"qing/app/defs"
)

// ContextLanguage returns context localization language ID in the given request.
func ContextLanguage(ctx context.Context) string {
	result, _ := ctx.Value(defs.LanguageContextKey).(string)
	return result
}

// ContextSID returns context SID in the given request.
func ContextSID(ctx context.Context) string {
	result, _ := ctx.Value(defs.SIDContextKey).(string)
	return result
}

// ContextUser returns context user in the given request.
func ContextUser(ctx context.Context) *SessionUser {
	result, _ := ctx.Value(defs.UserContextKey).(*SessionUser)
	return result
}

// ContextUserID returns context user ID in the given request.
func ContextUserID(ctx context.Context) uint64 {
	user := ContextUser(ctx)
	if user != nil {
		return user.ID
	}
	return 0
}

// ContextDict returns context dict in the given request.
func ContextDict(ctx context.Context) map[string]interface{} {
	result, _ := ctx.Value(defs.DictContextKey).(map[string]interface{})
	return result
}
