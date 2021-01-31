package userx

import (
	"database/sql"
	"net/http"
	"qing/app/appcom"
	"qing/app/cfg/config"
	"qing/app/defs"
	"qing/app/handler"
	"qing/app/urlx"
	"qing/da"
)

// UserManager manages user sessions.
type UserManager struct {
	SessionManager  *SessionManager
	MainPageManager *handler.MainPageManager
	DB              *sql.DB

	appURL      *urlx.URL
	forumsMode  bool
	debugConfig *config.DebugConfig
}

// NewUserManager creates a new UserManager.
func NewUserManager(
	db *sql.DB,
	ssMgr *SessionManager,
	tm *handler.MainPageManager,
	appURL *urlx.URL,
	forumsMode bool,
	debugConfig *config.DebugConfig,
) *UserManager {
	ret := &UserManager{DB: db, SessionManager: ssMgr, MainPageManager: tm, appURL: appURL, debugConfig: debugConfig, forumsMode: forumsMode}
	return ret
}

// CreateUserSessionFromUID creates a User from the given uid.
func (appu *UserManager) CreateUserSessionFromUID(uid uint64) (*appcom.SessionUser, error) {
	db := appu.DB
	if appu.forumsMode {
		u, err := da.User.SelectSessionDataForumMode(db, uid)
		if err != nil {
			return nil, err
		}
		isForumMod := false
		if u.IsForumMod != nil {
			isForumMod = true
		}
		user := appu.SessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, u.Status, isForumMod)
		return user, nil
	}
	u, err := da.User.SelectSessionData(db, uid)
	if err != nil {
		return nil, err
	}
	user := appu.SessionManager.NewSessionUser(uid, u.Name, u.IconName, u.Admin, u.Status, false)
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
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(r, w)
			resp.MustFailWithCode(defs.Shared.ErrNeedAuth)
		}
	})
}
