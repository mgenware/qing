package userx

import (
	"database/sql"
	"net/http"
	"qing/app/cfg/config"
	"qing/app/cm"
	"qing/app/defs"
	"qing/app/handler"
	"qing/app/urlx"
	"qing/da"
)

// UserManager manages user sessions.
type UserManager struct {
	SessionManager  *SessionManager
	TemplateManager *handler.Manager
	DB              *sql.DB

	appURL      *urlx.URL
	debugConfig *config.DebugConfig
}

// NewUserManager creates a new UserManager.
func NewUserManager(
	db *sql.DB,
	ssMgr *SessionManager,
	tm *handler.Manager,
	appURL *urlx.URL,
	debugConfig *config.DebugConfig,
) *UserManager {
	ret := &UserManager{DB: db, SessionManager: ssMgr, TemplateManager: tm, appURL: appURL, debugConfig: debugConfig}
	return ret
}

// CreateUserSessionFromUID creates a cm.User from the given uid.
func (appu *UserManager) CreateUserSessionFromUID(uid uint64) (*cm.User, error) {
	dbUser, err := da.User.SelectSessionData(appu.DB, uid)
	if err != nil {
		return nil, err
	}
	user := appu.SessionManager.NewUser(uid, dbUser.Name, dbUser.IconName, dbUser.Admin)
	return user, nil
}

// RequireLoginMiddlewareHTML is a middleware that requires login. Otherwise, redirects the user to sign in page.
func (appu *UserManager) RequireLoginMiddlewareHTML(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := cm.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			http.Redirect(w, r, appu.appURL.SignIn(), http.StatusFound)
		}
	})
}

// RequireLoginMiddlewareJSON is a middleware that requires login. Otherwise, returns NeedAuth error code.
func (appu *UserManager) RequireLoginMiddlewareJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := cm.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(r, appu.TemplateManager, w)
			resp.MustFailWithCode(defs.Constants.ErrNeedAuth)
		}
	})
}

// UnsafeRequireAdminMiddlewareJSON must be called after RequireLoginMiddlewareJSON, it makes sure only admins have access to the underlying handlers.
func (appu *UserManager) UnsafeRequireAdminMiddlewareJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := cm.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := handler.NewJSONResponse(r, appu.TemplateManager, w)
			resp.MustFailWithCode(defs.Constants.ErrNeedAuth)
		}
	})
}
