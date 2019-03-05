package cm

import (
	"context"
	"qing/app/defs"
)

func ContextSID(ctx context.Context) string {
	sidv := ctx.Value(defs.SIDContextKey)
	if sidv == nil {
		return ""
	}
	return sidv.(string)
}

func ContextUser(ctx context.Context) *User {
	usrv := ctx.Value(defs.UserContextKey)
	if usrv == nil {
		return nil
	}
	return usrv.(*User)
}

func ContextUserID(ctx context.Context) uint64 {
	user := ContextUser(ctx)
	if user != nil {
		return user.ID
	}
	return 0
}
