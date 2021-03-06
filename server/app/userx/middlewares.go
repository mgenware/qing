/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package userx

import (
	"net/http"
	"qing/app/appCookies"
	"qing/app/appcom"
	"qing/app/defs"
)

func (sm *SessionManager) Login(w http.ResponseWriter, r *http.Request, user *appcom.SessionUser) error {
	sid, err := sm.LoginCore(user)
	if err != nil {
		return err
	}
	cookie := newSessionCookie(sid)
	http.SetCookie(w, cookie)
	return nil
}

func (sm *SessionManager) LoginCore(user *appcom.SessionUser) (string, error) {
	sid, err := newSessionID(user.ID)
	if err != nil {
		return "", err
	}
	err = sm.SetUserSession(sid, user)
	if err != nil {
		return "", err
	}
	return sid, nil
}

func (sm *SessionManager) Logout(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	sid := appcom.ContextSID(ctx)
	uid := appcom.ContextUserID(ctx)
	if sid == "" {
		sm.logger.Warn("session.logout.emptySid")
		// just return if not signed in
		return nil
	}

	// server: remove session
	err := sm.LogoutCore(uid, sid)
	if err != nil {
		sm.logger.Warn("session.logout.removeSession", "err", err.Error())
		return nil
	}

	// client: set empty on sid cookie
	cookie := newDeletedSessionCookie(sid)
	http.SetCookie(w, cookie)
	return nil
}

func (sm *SessionManager) LogoutCore(uid uint64, sid string) error {
	return sm.RemoveUserSession(uid, sid)
}

func newSessionCookie(sid string) *http.Cookie {
	return appCookies.NewCookie(defs.SessionCookieKey, sid)
}

func newDeletedSessionCookie(sid string) *http.Cookie {
	return appCookies.DeleteCookie(defs.SessionCookieKey)
}
