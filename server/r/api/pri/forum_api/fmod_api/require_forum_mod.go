package fmodapi

import (
	"context"
	"net/http"
	"qing/app/appcom"
	"qing/app/defs"
	"qing/app/handler"
	"qing/lib/validator"
	modutil "qing/r/api/pri/forum_api/mod_util"
)

// RequireForumModeJSONMiddleware is a middleware that provides authentication for forum mods.
func RequireForumModeJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		params := appcom.ContextDict(ctx)

		resp := handler.NewJSONResponse(r, w)
		forumID := validator.GetIDFromDict(params, "forum_id")
		if forumID == 0 {
			resp.MustFailWithUserError("forum_id is empty")
			return
		}

		perm, err := modutil.GetRequestForumPermLevel(r, forumID)
		if err != nil {
			resp.MustFailWithUserError(err.Error())
			return
		}
		if perm < modutil.PermLevelForum {
			resp.MustFailWithCode(defs.Shared.ErrPermissionDenied)
			return
		}

		ctx = context.WithValue(ctx, defs.ForumIDContextKey, forumID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
