/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package userx

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/appcom"
	"qing/app/config"
	"qing/app/defs"
	"qing/app/handler"
	"qing/app/urlx"
	"qing/da"
)

// UserManager manages user sessions.
type UserManager struct {
	sessionManager  *SessionManager
	mainPageManager handler.CorePageManager
	db              app.CoreDB

	appURL     *urlx.URL
	forumsMode bool
	conf       *config.Config

	// [Test mode only] K: UID, V: SID.
	testSIDMap map[uint64]string
}

// NewUserManager creates a new UserManager.
func NewUserManager(
	db app.CoreDB,
	ssMgr *SessionManager,
	tm handler.CorePageManager,
	appURL *urlx.URL,
	forumsMode bool,
	conf *config.Config,
) *UserManager {
	ret := &UserManager{db: db, sessionManager: ssMgr, mainPageManager: tm, appURL: appURL, conf: conf, forumsMode: forumsMode}
	if conf.TestMode {
		ret.testSIDMap = make(map[uint64]string)
	}
	return ret
}

func (appu *UserManager) Login(uid uint64, w http.ResponseWriter, r *http.Request) error {
	user, err := appu.createUserSessionFromUID(uid)
	if err != nil {
		return err
	}

	return appu.sessionManager.Login(w, r, user)
}

func (appu *UserManager) TestLogin(uid uint64) {
	conf := appu.conf
	if !conf.TestMode {
		panic("This func is only available in test mode")
	}
	user, err := appu.createUserSessionFromUID(uid)
	if err != nil {
		panic(err)
	}

	sid, err := appu.sessionManager.LoginCore(user)
	if err != nil {
		panic(err)
	}
	appu.testSIDMap[uid] = sid
}

func (appu *UserManager) Logout(w http.ResponseWriter, r *http.Request) error {
	return appu.sessionManager.Logout(w, r)
}

func (appu *UserManager) TestLogout(uid uint64) error {
	conf := appu.conf
	if !conf.TestMode {
		panic("This func is only available in text mode")
	}

	sid := appu.testSIDMap[uid]
	if sid == "" {
		panic(fmt.Sprintf("UID %v not found", uid))
	}
	return appu.sessionManager.LogoutCore(uid, sid)
}

func (appu *UserManager) UpdateUserSession(sid string, user *appcom.SessionUser) error {
	return appu.sessionManager.SetUserSession(sid, user)
}

func (appu *UserManager) ParseUserSessionMiddleware(next http.Handler) http.Handler {
	return appu.sessionManager.ParseUserSessionMiddleware(next)
}

// createUserSessionFromUID fetches user info from DB and creates a `appcom.SessionUser`.
func (appu *UserManager) createUserSessionFromUID(uid uint64) (*appcom.SessionUser, error) {
	db := appu.db
	if appu.forumsMode {
		u, err := da.User.SelectSessionDataForumMode(db.DB(), uid)
		if err != nil {
			return nil, err
		}
		isForumMod := false
		if u.IsForumMod != nil {
			isForumMod = true
		}
		user := appu.sessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, u.Status, isForumMod)
		return user, nil
	}
	u, err := da.User.SelectSessionData(db.DB(), uid)
	if err != nil {
		return nil, err
	}
	user := appu.sessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, u.Status, false)
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
		if user != nil && user.Admin {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(r, w)
			resp.MustFailWithCode(defs.Shared.ErrNeedAuth)
		}
	})
}
