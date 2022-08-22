/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fgmodapi

import (
	"context"
	"errors"
	"net/http"
	"qing/a/appHandler"
	"qing/a/appcom"
	"qing/a/def"
	"qing/a/handler"
	"qing/lib/clib"
	modutil "qing/r/api/pri/forum_api/mod_util"
)

// RequireGroupModeJSONMiddleware is a middleware that provides authentication for forum group mods.
func RequireGroupModeJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		params := appcom.ContextDict(ctx)
		sUser := appcom.ContextUser(ctx)

		resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
		groupID := clib.GetIDFromDict(params, "forumGroupID")
		if groupID == 0 {
			resp.MustFail(errors.New("forum_group_id is empty"))
			return
		}

		perm, err := modutil.GetRequestForumGroupPermLevel(sUser, groupID)
		if err != nil {
			resp.MustFail(err)
			return
		}
		if perm < modutil.PermLevelForumGroup {
			resp.MustFailWithMsg(resp.LS().PermissionDenied)
			return
		}
		ctx = context.WithValue(ctx, def.ForumGroupIDContextKey, groupID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
