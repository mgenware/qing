package userx

import (
	"database/sql"
	"net/http"
	"qing/app/cm"
	"qing/app/config/internals"
	"qing/app/defs"
	"qing/app/template"
	"qing/app/urlx"
	"qing/da"
)

type UserManager struct {
	SessionManager  *SessionManager
	TemplateManager *template.Manager
	DB              *sql.DB

	appURL      *urlx.URL
	debugConfig *internals.DebugConfig
}

func NewUserManager(
	db *sql.DB,
	ssMgr *SessionManager,
	tm *template.Manager,
	appURL *urlx.URL,
	debugConfig *internals.DebugConfig,
) *UserManager {
	ret := &UserManager{DB: db, SessionManager: ssMgr, TemplateManager: tm, appURL: appURL, debugConfig: debugConfig}
	return ret
}

func (appu *UserManager) CreateUserSessionFromUID(uid uint64) (*cm.User, error) {
	dbUser, err := da.User.SelectSessionData(appu.DB, uid)
	if err != nil {
		return nil, err
	}
	user := appu.SessionManager.NewUser(uid, dbUser.Name, dbUser.IconName)
	return user, nil
}

func (appu *UserManager) EnsureLoggedInMWHTML(next http.Handler) http.Handler {
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

func (appu *UserManager) EnsureLoggedInMWJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := cm.ContextUser(ctx)
		if user != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			resp := template.NewJSONResponse(ctx, appu.TemplateManager, w, appu.debugConfig)
			resp.MustFailWithCode(defs.APINeedAuthError)
		}
	})
}
