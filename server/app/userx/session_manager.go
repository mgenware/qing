package userx

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"qing/app/appcom"
	"qing/app/defs"
	"qing/app/extern/redisx"
	"qing/app/logx"
	"qing/app/urlx"
	"qing/lib/validator"

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
	logger *logx.Logger
	appURL *urlx.URL
	store  *redisx.Conn
}

// NewRedisBasedSessionManager creates a redis-backed SessionManager.
func NewRedisBasedSessionManager(store *redisx.Conn, logger *logx.Logger, appURL *urlx.URL) (*SessionManager, error) {
	return &SessionManager{logger: logger, store: store, appURL: appURL}, nil
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

	keySIDToUser := sidToUserKey(sid)
	err = sm.store.SetStringValue(keySIDToUser, bytes, defs.CookieDefaultExpires)
	if err != nil {
		return err
	}

	keyUIDToSID := userIDToSIDKey(user.ID)
	err = sm.store.SetStringValue(keyUIDToSID, sid, defs.CookieDefaultExpires)
	if err != nil {
		return err
	}
	return nil
}

// GetUserSession retrieves an user from internal store by the given sid.
func (sm *SessionManager) GetUserSession(sid string) (*appcom.SessionUser, error) {
	keySIDToUser := sidToUserKey(sid)
	str, err := sm.store.GetStringValue(keySIDToUser)
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
	return sm.store.GetStringValue(keyUIDToSID)
}

func (sm *SessionManager) RemoveUserSession(uid uint64, sid string) error {
	keySIDToUser := sidToUserKey(sid)

	err := sm.store.RemoveValue(keySIDToUser)
	if err != nil {
		return err
	}

	keyUIDToSID := userIDToSIDKey(uid)
	return sm.store.RemoveValue(keyUIDToSID)
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

// NewUser creates a new session user based on required properties.
func (sm *SessionManager) NewUser(id uint64, name string, iconName string, admin bool) *appcom.SessionUser {
	u := &appcom.SessionUser{ID: id, Name: name, IconName: iconName, Admin: admin}
	sm.computeUserFields(u)
	return u
}

func (sm *SessionManager) computeUserFields(u *appcom.SessionUser) {
	uid := u.ID
	u.URL = sm.appURL.UserProfile(uid)
	u.IconURL = sm.appURL.UserIconURL50(uid, u.IconName)
	u.EID = validator.EncodeID(uid)
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
