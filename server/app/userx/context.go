package userx

import (
	"context"
	"qing/app/defs"
)

func ContextSID(ctx context.Context) string {
	sidv := ctx.Value(defs.ContextSIDKey)
	if sidv == nil {
		return ""
	}
	return sidv.(string)
}

func ContextUser(ctx context.Context) *User {
	usrv := ctx.Value(defs.ContextUserKey)
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
