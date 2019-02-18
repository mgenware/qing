package defs

import (
	"context"
)

// LanguageContext returns the localization language ID associated with the specified context.
func LanguageContext(ctx context.Context) string {
	return stringFromContext(ctx, LanguageContextKey)
}

func stringFromContext(ctx context.Context, key ContextKey) string {
	val := ctx.Value(key)
	if val == nil {
		return ""
	}
	return val.(string)
}
