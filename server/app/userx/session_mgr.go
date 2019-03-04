package userx

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"qing/app/defs"
	"qing/app/logx"
	"qing/app/urlx"

	"github.com/garyburd/redigo/redis"
	"github.com/google/uuid"
	"github.com/mgenware/go-packagex/strconvx"
	"github.com/mgenware/gossion"
	"github.com/mgenware/gossion/redisStore"
)

// User contains user infomation stored in session store
type User struct {
	ID       uint64 `json:"id"`
	Name     string `json:"name"`
	IconName string `json:"icon"`

	// Generated props when deserialized
	URL     string `json:"-"`
	IconURL string `json:"-"`
}

// Serialize encode the user object to JSON.
func (u *User) Serialize() ([]byte, error) {
	b, err := json.Marshal(u)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func newSessionID(uid uint64) (string, error) {
	id, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%v:%v", uid, id.String()), nil
}

func sidToUserKey(sid string) string {
	return defs.RedisSIDToUser + ":" + sid
}

func userIDToSIDKey(uid uint64) string {
	return defs.RedisUserIDToSID + ":" + strconvx.ToString(uid)
}

// SessionManager ...
type SessionManager struct {
	logger *logx.Logger
	appURL *urlx.URL
	store  gossion.Store
}

// NewRedisBasedSessionManager creates a redis-backed SessionManager.
func NewRedisBasedSessionManager(pool *redis.Pool, logger *logx.Logger, appURL *urlx.URL) (*SessionManager, error) {
	store, err := redisStore.NewRedisStoreFromPool(pool)
	if err != nil {
		return nil, err
	}
	return &SessionManager{logger: logger, store: store, appURL: appURL}, nil
}

// SetUserSession sets an user to the internal store.
func (sm *SessionManager) SetUserSession(sid string, user *User) error {
	if user == nil {
		return errors.New("user cannot be nil")
	}

	bytes, err := user.Serialize()
	if err != nil {
		return err
	}

	keySIDToUser := sidToUserKey(sid)
	err = sm.store.SetBytes(keySIDToUser, bytes, defs.CookieDefaultExpires)
	if err != nil {
		return err
	}

	keyUIDToSID := userIDToSIDKey(user.ID)
	err = sm.store.SetString(keyUIDToSID, sid, defs.CookieDefaultExpires)
	if err != nil {
		return err
	}
	return nil
}

// GetUserSession retrieves an user from internal store by the given sid.
func (sm *SessionManager) GetUserSession(sid string) (*User, error) {
	keySIDToUser := sidToUserKey(sid)
	bytes, err := sm.store.GetBytes(keySIDToUser)
	if err != nil {
		return nil, err
	}
	if bytes == nil {
		return nil, errors.New("Session bytes nil")
	}

	user, err := sm.deserializeUserJSON(bytes)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (sm *SessionManager) GetSIDFromUID(uid uint64) (string, error) {
	keyUIDToSID := userIDToSIDKey(uid)
	return sm.store.GetString(keyUIDToSID)
}

func (sm *SessionManager) RemoveUserSession(uid uint64, sid string) error {
	keySIDToUser := sidToUserKey(sid)

	err := sm.store.Remove(keySIDToUser)
	if err != nil {
		return err
	}

	keyUIDToSID := userIDToSIDKey(uid)
	return sm.store.Remove(keyUIDToSID)
}

func (sm *SessionManager) ParseUserSessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get cookie session id
		sidcookie, _ := r.Cookie(defs.CookieSessionKey)
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
				sm.logger.LogError("session-parsing-error", logx.D{
					"error": err.Error(),
				})
			}

			// destroy the invalid cookie
			http.SetCookie(w, newDeletedSessionCookie(sid))
		}

		ctx := r.Context()
		if user != nil {
			// logged in
			// set info to ctx
			ctx = context.WithValue(ctx, defs.ContextSIDKey, sid)
			ctx = context.WithValue(ctx, defs.ContextUserKey, user)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewUser creates a new session user based on required properties.
func (sm *SessionManager) NewUser(id uint64, name string, iconName string) *User {
	u := &User{ID: id, Name: name, IconName: iconName}
	sm.computeUserFields(u)
	return u
}

func (sm *SessionManager) computeUserFields(u *User) {
	uid := u.ID
	u.URL = sm.appURL.UserProfile(uid)
	u.IconURL = sm.appURL.UserAvatarURL50(uid, u.IconName)
}

func (sm *SessionManager) deserializeUserJSON(b []byte) (*User, error) {
	u := &User{}
	err := json.Unmarshal(b, u)
	if err != nil {
		return nil, err
	}
	sm.computeUserFields(u)
	return u, nil
}
