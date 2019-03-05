package defs

import (
	"context"
)

// LanguageContext returns the localization language ID associated with the specified context.
func LanguageContext(ctx context.Context) string {
	val := ctx.Value(LanguageContextKey)
	if val == nil {
		return ""
	}
	return val.(string)
}
