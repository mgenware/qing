package fgmodapi

import (
	"net/http"
	"qing/app/defs"
	"qing/app/handler"
	modutil "qing/r/api/pri/forum_api/mod_util"
)

// RequireGroupModeMiddlewareJSON is a middleware that provides authentication for forum group mods.
func RequireGroupModeMiddlewareJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		perm, err := modutil.GetRequestForumGroupPermLevel(r)
		resp := handler.NewJSONResponse(r, w)
		if err != nil {
			resp.MustFailWithUserError(err.Error())
			return
		}
		if perm < modutil.PermLevelForumGroup {
			resp.MustFailWithCode(defs.Shared.ErrPermissionDenied)
			return
		}
		next.ServeHTTP(w, r.WithContext(r.Context()))
	})
}
