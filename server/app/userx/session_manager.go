/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package userx

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/appMS"
	"qing/app/appcom"
	"qing/app/defs"
	"qing/app/urlx"
	"qing/lib/fmtx"

	"github.com/google/uuid"
)

func newSessionID(uid uint64) (string, error) {
	id, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%v:%v", uid, id.String()), nil
}

func sidToUserKey(sid string) string {
	return fmt.Sprintf(defs.MSSIDToUser, sid)
}

func userIDToSIDKey(uid uint64) string {
	return fmt.Sprintf(defs.MSUserIDToSID, fmt.Sprint(uid))
}

// SessionManager ...
type SessionManager struct {
	logger app.CoreLogger
	appURL *urlx.URL
}

// NewMemoryBasedSessionManager creates a memory-backed SessionManager.
func NewMemoryBasedSessionManager(logger app.CoreLogger, appURL *urlx.URL) (*SessionManager, error) {
	return &SessionManager{logger: logger, appURL: appURL}, nil
}

// SetUserSession sets an user to the internal store.
func (sm *SessionManager) SetUserSession(sid string, user *appcom.SessionUser) error {
	if user == nil {
		return errors.New("user cannot be nil")
	}

	bytes, err := user.Serialize()
	if err != nil {
		return err
	}

	msConn := appMS.GetConn()
	keySIDToUser := sidToUserKey(sid)
	err = msConn.SetStringValue(keySIDToUser, bytes, defs.MSExpirySecs)
	if err != nil {
		return err
	}

	keyUIDToSID := userIDToSIDKey(user.ID)
	err = msConn.SetStringValue(keyUIDToSID, sid, defs.MSExpirySecs)
	if err != nil {
		return err
	}
	return nil
}

// GetUserSession retrieves an user from internal store by the given sid.
func (sm *SessionManager) GetUserSession(sid string) (*appcom.SessionUser, error) {
	keySIDToUser := sidToUserKey(sid)
	msConn := appMS.GetConn()
	str, err := msConn.GetStringValue(keySIDToUser)
	if err != nil {
		return nil, err
	}
	if str == "" {
		return nil, errors.New("Session value empty")
	}

	user, err := sm.deserializeUserJSON([]byte(str))
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (sm *SessionManager) GetSIDFromUID(uid uint64) (string, error) {
	keyUIDToSID := userIDToSIDKey(uid)
	msConn := appMS.GetConn()
	return msConn.GetStringValue(keyUIDToSID)
}

func (sm *SessionManager) RemoveUserSession(uid uint64, sid string) error {
	keySIDToUser := sidToUserKey(sid)

	msConn := appMS.GetConn()
	err := msConn.RemoveValue(keySIDToUser)
	if err != nil {
		return err
	}

	keyUIDToSID := userIDToSIDKey(uid)
	return msConn.RemoveValue(keyUIDToSID)
}

func (sm *SessionManager) ParseUserSessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get cookie session id
		sidcookie, _ := r.Cookie(defs.SessionCookieKey)
		if sidcookie == nil || sidcookie.String() == "" {
			// no sid in cookie
			next.ServeHTTP(w, r)
			return
		}

		sid := sidcookie.Value
		// read session info from sid
		user, err := sm.GetUserSession(sid)
		if err != nil {
			// ignore session parsing error
			if sm.logger != nil {
				sm.logger.Error("session-parsing-error",
					"error", err.Error(),
				)
			}

			// destroy the invalid cookie
			http.SetCookie(w, newDeletedSessionCookie(sid))
		}

		ctx := r.Context()
		if user != nil {
			// logged in
			// set info to ctx
			ctx = context.WithValue(ctx, defs.SIDContextKey, sid)
			ctx = context.WithValue(ctx, defs.UserContextKey, user)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewSessionUser creates a new SessionUser based on the required properties.
func (sm *SessionManager) NewSessionUser(id uint64, name string, iconName string, admin bool, isForumMod bool) *appcom.SessionUser {
	u := &appcom.SessionUser{ID: id, Name: name, IconName: iconName, Admin: admin, IsForumMod: isForumMod}
	sm.computeUserFields(u)
	return u
}

func (sm *SessionManager) computeUserFields(u *appcom.SessionUser) {
	uid := u.ID
	u.URL = sm.appURL.UserProfile(uid)
	u.IconURL = sm.appURL.UserIconURL50(uid, u.IconName)
	u.EID = fmtx.EncodeID(uid)
}

func (sm *SessionManager) deserializeUserJSON(b []byte) (*appcom.SessionUser, error) {
	u := &appcom.SessionUser{}
	err := json.Unmarshal(b, u)
	if err != nil {
		return nil, err
	}
	sm.computeUserFields(u)
	return u, nil
}
