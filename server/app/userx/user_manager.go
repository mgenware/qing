/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package userx

import (
	"net/http"
	"qing/app"
	"qing/app/appcom"
	"qing/app/config/configs"
	"qing/app/defs"
	"qing/app/handler"
	"qing/app/urlx"
	"qing/da"
)

// UserManager manages user sessions.
type UserManager struct {
	SessionManager  *SessionManager
	MainPageManager handler.CorePageManager
	DB              app.CoreDB

	appURL      *urlx.URL
	forumsMode  bool
	debugConfig *configs.DebugConfig
}

// NewUserManager creates a new UserManager.
func NewUserManager(
	db app.CoreDB,
	ssMgr *SessionManager,
	tm handler.CorePageManager,
	appURL *urlx.URL,
	forumsMode bool,
	debugConfig *configs.DebugConfig,
) *UserManager {
	ret := &UserManager{DB: db, SessionManager: ssMgr, MainPageManager: tm, appURL: appURL, debugConfig: debugConfig, forumsMode: forumsMode}
	return ret
}

// CreateUserSessionFromUID creates a User from the given uid.
func (appu *UserManager) CreateUserSessionFromUID(uid uint64) (*appcom.SessionUser, error) {
	db := appu.DB
	if appu.forumsMode {
		u, err := da.User.SelectSessionDataForumMode(db.DB(), uid)
		if err != nil {
			return nil, err
		}
		isForumMod := false
		if u.IsForumMod != nil {
			isForumMod = true
		}
		user := appu.SessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, u.Status, isForumMod)
		return user, nil
	}
	u, err := da.User.SelectSessionData(db.DB(), uid)
	if err != nil {
		return nil, err
	}
	user := appu.SessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, u.Status, false)
	return user, nil
}

// RequireLoginHTMLMiddleware is a middleware that requires login. Otherwise, redirects the user to sign in page.
func (appu *UserManager) RequireLoginHTMLMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := appcom.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			http.Redirect(w, r, appu.appURL.SignIn(), http.StatusFound)
		}
	})
}

// RequireLoginJSONMiddleware is a middleware that requires login. Otherwise, returns NeedAuth error code.
func (appu *UserManager) RequireLoginJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := appcom.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(r, w)
			resp.MustFailWithCode(defs.Shared.ErrNeedAuth)
		}
	})
}

// UnsafeRequireAdminMiddlewareJSON must be called after RequireLoginJSONMiddleware, it makes sure only admins have access to the underlying handlers.
func (appu *UserManager) UnsafeRequireAdminMiddlewareJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := appcom.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(r, w)
			resp.MustFailWithCode(defs.Shared.ErrNeedAuth)
		}
	})
}
