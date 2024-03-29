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
	"qing/a/appEnv"
	"qing/a/appHandler"
	"qing/a/appcm"
	"qing/a/cfgx"
	"qing/a/coretype"
	"qing/a/handler"
	"qing/a/urlx"
	"qing/da"
)

// UserManager manages user sessions.
type UserManager struct {
	sessionManager  *SessionManager
	mainPageManager handler.CorePageManager
	db              coretype.CoreDB

	appURL *urlx.URL
	cfg    *cfgx.CoreConfig

	// [Test mode only] K: UID, V: SID.
	testSIDMap map[uint64]string
}

// NewUserManager creates a new UserManager.
func NewUserManager(
	db coretype.CoreDB,
	ssMgr *SessionManager,
	tm handler.CorePageManager,
	appURL *urlx.URL,
	cfg *cfgx.CoreConfig,
) (*UserManager, error) {
	res := &UserManager{db: db, sessionManager: ssMgr, mainPageManager: tm, appURL: appURL, cfg: cfg}
	if appEnv.IsUT() {
		res.testSIDMap = make(map[uint64]string)
	}
	return res, nil
}

func (appu *UserManager) Login(uid uint64, w http.ResponseWriter, r *http.Request) error {
	user, err := appu.createUserSessionFromUID(uid)
	if err != nil {
		return err
	}

	return appu.sessionManager.Login(w, r, user)
}

func (appu *UserManager) TestLogin(uid uint64) {
	if !appEnv.IsUT() {
		panic(fmt.Errorf("this func is only available in unit test mode"))
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
	if !appEnv.IsUT() {
		panic(fmt.Errorf("this func is only available in unit test mode"))
	}

	sid := appu.testSIDMap[uid]
	if sid == "" {
		panic(fmt.Errorf("UID %v not found", uid))
	}
	return appu.sessionManager.LogoutCore(uid, sid)
}

func (appu *UserManager) UpdateUserSession(sid string, user *appcm.SessionUser) error {
	return appu.sessionManager.SetUserSession(sid, user)
}

func (appu *UserManager) ParseUserSessionMiddleware(next http.Handler) http.Handler {
	return appu.sessionManager.ParseUserSessionMiddleware(next)
}

// Fetches user info from DB and creates an `appcm.SessionUser`.
func (appu *UserManager) createUserSessionFromUID(uid uint64) (*appcm.SessionUser, error) {
	db := appu.db
	u, err := da.User.SelectSessionData(db.DB(), uid)
	if err != nil {
		return nil, err
	}
	user := appu.sessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, u.Lang)
	return user, nil
}

// RequireLoginHTMLMiddleware is a middleware that requires login. Otherwise, redirects the user to sign in page.
func (appu *UserManager) RequireLoginHTMLMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := appcm.ContextUser(ctx)
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
		user := appcm.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
			resp.MustFail(resp.LS().NeedAuthErr)
		}
	})
}

// UnsafeRequireAdminJSONMiddleware must be called after RequireLoginJSONMiddleware, it makes sure only admins have access to the underlying handlers.
func (appu *UserManager) UnsafeRequireAdminJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := appcm.ContextUser(ctx)
		if user != nil && user.Admin {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
			resp.MustFail(resp.LS().NeedAuthErr)
		}
	})
}
