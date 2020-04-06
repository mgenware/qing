package userx

import (
	"database/sql"
	"net/http"
	"qing/app/cfg/config"
	"qing/app/cm"
	"qing/app/errs"
	"qing/app/handler"
	"qing/app/urlx"
	"qing/da"
)

type UserManager struct {
	SessionManager  *SessionManager
	TemplateManager *handler.Manager
	DB              *sql.DB

	appURL      *urlx.URL
	debugConfig *config.DebugConfig
}

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
			resp := handler.NewJSONResponse(r, appu.TemplateManager, w)
			resp.MustFailWithCode(errs.NeedAuth)
		}
	})
}
