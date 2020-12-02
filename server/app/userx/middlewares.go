package userx

import (
	"net/http"
	"qing/app/appcom"
	"qing/app/defs"
	"time"
)

func (sm *SessionManager) Login(w http.ResponseWriter, r *http.Request, user *appcom.SessionUser) error {
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
	sid := appcom.ContextSID(ctx)
	uid := appcom.ContextUserID(ctx)
	if sid == "" {
		sm.logger.Warn("session.logout.emptySid")
		// just return if not signed in
		return nil
	}

	// server: remove session
	err := sm.RemoveUserSession(uid, sid)
	if err != nil {
		sm.logger.Warn("session.logout.removeSession", "err", err.Error())
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
	cookie := &http.Cookie{Name: defs.SessionCookieKey, Value: sid}
	cookie.Path = "/"
	cookie.Expires = exptime
	return cookie
}

func newDeletedSessionCookie(sid string) *http.Cookie {
	t := time.Now()
	exptime := t.AddDate(-1, -1, -1)
	cookie := &http.Cookie{Name: defs.SessionCookieKey, Value: ""}
	cookie.Path = "/"
	cookie.Expires = exptime
	return cookie
}
