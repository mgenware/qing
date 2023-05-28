/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fmodapi

import (
	"context"
	"fmt"
	"net/http"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/def"
	"qing/lib/clib"
	modutil "qing/r/api/pri/forum_api/mod_util"
)

// RequireForumModeJSONMiddleware is a middleware that provides authentication for forum mods.
func RequireForumModeJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		params := appcm.ContextDict(ctx)
		sUser := appcm.ContextUser(ctx)

		resp := appHandler.JSONResponse(w, r)
		forumID := clib.GetIDFromDict(params, ForumIDParamName)
		if forumID == 0 {
			resp.MustFail(fmt.Sprintf("The argument `%v` is empty", ForumIDParamName))
			return
		}

		perm, err := modutil.GetRequestForumPermLevel(sUser, forumID)
		if err != nil {
			resp.MustFail(fmt.Sprintf("Error getting forum perm level: %v", err))
			return
		}
		if perm < modutil.PermLevelForum {
			resp.MustFail(resp.LS().PermissionDenied)
			return
		}

		ctx = context.WithValue(ctx, def.ForumIDContextKey, forumID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
