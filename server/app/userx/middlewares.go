package userx

import (
	"net/http"
	"qing/app/defs"
	"qing/app/logx"
	"time"
)

func (sm *SessionManager) Login(w http.ResponseWriter, r *http.Request, user *User) error {
	sid, err := newSessionID(user.ID)
	if err != nil {
		return err
	}
	err = sm.SetUserSession(sid, user)
	if err != nil {
		return err
	}

	cookie := newSessionCookie(sid)
	http.SetCookie(w, cookie)
	return nil
}

func (sm *SessionManager) Logout(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	sid := ContextSID(ctx)
	uid := ContextUserID(ctx)
	if sid == "" {
		sm.logger.LogWarning("session.logout.emptySid", nil)
		// just return if not signed in
		return nil
	}

	// server: remove session
	err := sm.RemoveUserSession(uid, sid)
	if err != nil {
		sm.logger.LogWarning("session.logout.removeSession", logx.D{"err": err.Error()})
		return nil
	}

	// client: set empty on sid cookie
	cookie := newDeletedSessionCookie(sid)
	http.SetCookie(w, cookie)
	return nil
}

/* cookies */
func newSessionCookie(sid string) *http.Cookie {
	t := time.Now()
	exptime := t.AddDate(0, 0, 30)
	cookie := &http.Cookie{Name: defs.CookieSessionKey, Value: sid}
	cookie.Path = "/"
	cookie.Expires = exptime
	return cookie
}

func newDeletedSessionCookie(sid string) *http.Cookie {
	t := time.Now()
	exptime := t.AddDate(-1, -1, -1)
	cookie := &http.Cookie{Name: defs.CookieSessionKey, Value: ""}
	cookie.Path = "/"
	cookie.Expires = exptime
	return cookie
}
