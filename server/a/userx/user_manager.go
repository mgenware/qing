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
	"qing/a/appHandler"
	"qing/a/appcom"
	"qing/a/conf"
	"qing/a/coretype"
	"qing/a/handler"
	"qing/a/sitest"
	"qing/a/urlx"
	"qing/da"
)

// UserManager manages user sessions.
type UserManager struct {
	sessionManager  *SessionManager
	mainPageManager handler.CorePageManager
	db              coretype.CoreDB

	appURL       *urlx.URL
	config       *conf.Config
	siteSettings *sitest.SiteSettings

	// [Test mode only] K: UID, V: SID.
	testSIDMap map[uint64]string
}

// NewUserManager creates a new UserManager.
func NewUserManager(
	db coretype.CoreDB,
	ssMgr *SessionManager,
	tm handler.CorePageManager,
	appURL *urlx.URL,
	config *conf.Config,
	siteSettings *sitest.SiteSettings,
) *UserManager {
	ret := &UserManager{db: db, sessionManager: ssMgr, mainPageManager: tm, appURL: appURL, config: config, siteSettings: siteSettings}
	if conf.IsUTEnv() {
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
	if !conf.IsUTEnv() {
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
	if !conf.IsUTEnv() {
		panic(fmt.Errorf("this func is only available in unit test mode"))
	}

	sid := appu.testSIDMap[uid]
	if sid == "" {
		panic(fmt.Errorf("UID %v not found", uid))
	}
	return appu.sessionManager.LogoutCore(uid, sid)
}

func (appu *UserManager) UpdateUserSession(sid string, user *appcom.SessionUser) error {
	return appu.sessionManager.SetUserSession(sid, user)
}

func (appu *UserManager) ParseUserSessionMiddleware(next http.Handler) http.Handler {
	return appu.sessionManager.ParseUserSessionMiddleware(next)
}

// Fetches user info from DB and creates an `appcom.SessionUser`.
func (appu *UserManager) createUserSessionFromUID(uid uint64) (*appcom.SessionUser, error) {
	db := appu.db
	if appu.siteSettings.ForumSite() {
		u, err := da.User.SelectSessionDataForumMode(db.DB(), uid)
		if err != nil {
			return nil, err
		}
		isForumMod := false
		if u.IsForumMod != nil {
			isForumMod = true
		}
		user := appu.sessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, isForumMod, u.Lang)
		return user, nil
	}
	u, err := da.User.SelectSessionData(db.DB(), uid)
	if err != nil {
		return nil, err
	}
	user := appu.sessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, false, u.Lang)
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
			resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
			resp.MustFail(resp.LS().NeedAuthErr)
		}
	})
}

// UnsafeRequireAdminJSONMiddleware must be called after RequireLoginJSONMiddleware, it makes sure only admins have access to the underlying handlers.
func (appu *UserManager) UnsafeRequireAdminJSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := appcom.ContextUser(ctx)
		if user != nil && user.Admin {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(w, r, appHandler.LSManager())
			resp.MustFail(resp.LS().NeedAuthErr)
		}
	})
}
