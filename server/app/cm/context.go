package cm

import (
	"context"
	"qing/app/defs"
)

// LanguageContext returns the localization language ID associated with the specified context.
func LanguageContext(ctx context.Context) string {
	result, _ := ctx.Value(defs.LanguageContextKey).(string)
	return result
}

func ContextSID(ctx context.Context) string {
	result, _ := ctx.Value(defs.SIDContextKey).(string)
	return result
}

func ContextUser(ctx context.Context) *User {
	result, _ := ctx.Value(defs.UserContextKey).(*User)
	return result
}

func ContextUserID(ctx context.Context) uint64 {
	user := ContextUser(ctx)
	if user != nil {
		return user.ID
	}
	return 0
}

// BodyContext returns the localization language ID associated with the specified context.
func BodyContext(ctx context.Context) map[string]interface{} {
	result, _ := ctx.Value(defs.BodyContextKey).(map[string]interface{})
	return result
}
