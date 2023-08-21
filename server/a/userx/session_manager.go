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
	"net/url"
	"qing/a/appMS"
	"qing/a/appcm"
	"qing/a/cfgx"
	"qing/a/coretype"
	"qing/a/def"
	"qing/a/urlx"
	"qing/lib/clib"
	"qing/lib/httplib"

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
	return fmt.Sprintf(def.MSSIDToUser, sid)
}

func userIDToSIDKey(uid uint64) string {
	return fmt.Sprintf(def.MSUserIDToSID, fmt.Sprint(uid))
}

// Used internally in `UserManager` to manage sessions.
type SessionManager struct {
	logger coretype.CoreLogger
	appURL *urlx.URL
	cc     *cfgx.CoreConfig

	conn coretype.CoreMemoryStoreConn
}

func NewSessionManager(cc *cfgx.CoreConfig, conn coretype.CoreMemoryStoreConn, logger coretype.CoreLogger, appURL *urlx.URL) (*SessionManager, error) {
	return &SessionManager{conn: conn, logger: logger, appURL: appURL, cc: cc}, nil
}

func (sm *SessionManager) Login(w http.ResponseWriter, r *http.Request, user *appcm.SessionUser) error {
	sid, err := sm.LoginCore(user)
	if err != nil {
		return err
	}
	cookie := newSessionCookie(sid, sm.cc)
	http.SetCookie(w, cookie)
	return nil
}

func (sm *SessionManager) LoginCore(user *appcm.SessionUser) (string, error) {
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
	sid := appcm.ContextSID(ctx)
	uid := appcm.ContextUserID(ctx)
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

// SetUserSession sets an user to the internal store.
func (sm *SessionManager) SetUserSession(sid string, user *appcm.SessionUser) error {
	if user == nil {
		return errors.New("SetUserSession: `user` cannot be nil")
	}

	bytes, err := user.Serialize()
	if err != nil {
		return err
	}

	msConn := appMS.GetConn()
	keySIDToUser := sidToUserKey(sid)
	err = msConn.SetStringValue(keySIDToUser, bytes, def.MSDefaultExpiry)
	if err != nil {
		return err
	}

	keyUIDToSID := userIDToSIDKey(user.ID)
	err = msConn.SetStringValue(keyUIDToSID, sid, def.MSDefaultExpiry)
	if err != nil {
		return err
	}
	return nil
}

// GetUserSession retrieves an user from internal store by the given sid.
func (sm *SessionManager) GetUserSession(sid string) (*appcm.SessionUser, error) {
	keySIDToUser := sidToUserKey(sid)
	msConn := appMS.GetConn()
	_, userJSON, err := msConn.GetStringValue(keySIDToUser)
	if err != nil {
		return nil, err
	}
	if userJSON == "" {
		return nil, errors.New("empty user session JSON")
	}

	user, err := sm.deserializeUserJSON([]byte(userJSON))
	if err != nil {
		return nil, err
	}
	return user, nil
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
		// Get cookie session ID.
		sidCookie, _ := httplib.ReadCookie(r, def.SessionCookieKey)
		if sidCookie == "" {
			// NO SID found.
			next.ServeHTTP(w, r)
			return
		}

		sid, err := url.PathUnescape(sidCookie)
		if err != nil {
			// Ignore session parsing error.
			if sm.logger != nil {
				sm.logger.Error("parser-session.invalid-value",
					"error", err.Error(),
					"sidCookie", sidCookie,
				)
			}

			// Destroy the invalid cookie.
			http.SetCookie(w, newDeletedSessionCookie(sid))
		}
		// Read session info from SID.
		user, err := sm.GetUserSession(sid)
		if err != nil {
			// Ignore session parsing error.
			if sm.logger != nil {
				sm.logger.Error("parser-session.no-user-data",
					"error", err.Error(),
					"sid", sid,
				)
			}

			// Destroy the invalid cookie.
			http.SetCookie(w, newDeletedSessionCookie(sid))
		}

		ctx := r.Context()
		if user != nil {
			// Logged in. Update ctx.
			ctx = context.WithValue(ctx, def.SIDContextKey, sid)
			ctx = context.WithValue(ctx, def.UserContextKey, user)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewSessionUser creates a new SessionUser based on the required properties.
func (sm *SessionManager) NewSessionUser(id uint64, name string, iconName string, admin bool, lang string) *appcm.SessionUser {
	u := &appcm.SessionUser{ID: id, Name: name, IconName: iconName, Admin: admin, Lang: lang}
	sm.computeUserFields(u)
	return u
}

func (sm *SessionManager) computeUserFields(u *appcm.SessionUser) {
	uid := u.ID
	u.Link = sm.appURL.UserProfile(uid)
	u.IconURL = sm.appURL.UserIconURL50(uid, u.IconName)
	u.EID = clib.EncodeID(uid)
}

func (sm *SessionManager) deserializeUserJSON(b []byte) (*appcm.SessionUser, error) {
	u := &appcm.SessionUser{}
	err := json.Unmarshal(b, u)
	if err != nil {
		return nil, err
	}
	sm.computeUserFields(u)
	return u, nil
}
