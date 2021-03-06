/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import (
	"context"
	"net/http"
	"qing/app/appcom"
	"qing/app/defs"
	"qing/app/handler"
	"qing/lib/validator"
	modutil "qing/r/api/pri/forum_api/mod_util"
)

// RequireGroupModeJSONMiddleware is a middleware that provides authentication for forum group mods.
func RequireGroupModeJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		params := appcom.ContextDict(ctx)
		sUser := appcom.ContextUser(ctx)

		resp := handler.NewJSONResponse(r, w)
		groupID := validator.GetIDFromDict(params, "forumGroupID")
		if groupID == 0 {
			resp.MustFailWithUserError("forum_group_id is empty")
			return
		}

		perm, err := modutil.GetRequestForumGroupPermLevel(sUser, groupID)
		if err != nil {
			resp.MustFailWithUserError(err.Error())
			return
		}
		if perm < modutil.PermLevelForumGroup {
			resp.MustFailWithCode(defs.Shared.ErrPermissionDenied)
			return
		}
		ctx = context.WithValue(ctx, defs.ForumGroupIDContextKey, groupID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
