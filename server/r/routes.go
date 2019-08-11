package r

import (
	"log"
	"net/http"
	"qing/app/defs"
	"strconv"
	"strings"

	"qing/app"
	"qing/r/mPage"
	"qing/r/profilePage"
	"qing/r/sr"
	"qing/r/sys"
	"qing/r/t"
	"qing/r/postPage"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v5/iox"
)

// Start starts the web router.
func Start() {
	r := chi.NewRouter()
	config := app.Config
	httpConfig := config.HTTP

	// ----------------- Middlewares -----------------
	// THE PanicMiddleware MUST BE AT THE VERY BEGINNING, OTHERWISE IT WILL NOT WORK!
	r.Use(sys.PanicMiddleware)
	// User session middleware
	r.Use(app.UserManager.SessionManager.ParseUserSessionMiddleware)

	// Mount static file server
	httpStaticConfig := httpConfig.Static
	if httpStaticConfig != nil {
		url := httpStaticConfig.URL
		dir := httpStaticConfig.Dir
		app.Logger.Info("serving-assets",
			"url", url,
			"dir", dir,
		)
		fileServer(r, url, http.Dir(dir))
		if !iox.IsDirectory(dir) {
			app.Logger.Warn("serving-assets.not-found", "dir", dir)
		}
	}

	// Mount resources server
	rsConfig := config.ResServer
	if rsConfig != nil {
		url := rsConfig.URL
		dir := rsConfig.Dir
		app.Logger.Info("serving-res",
			"url", url,
			"dir", dir,
		)
		fileServer(r, url, http.Dir(dir))
		if !iox.IsDirectory(dir) {
			app.Logger.Warn("serving-res.not-found", "dir", dir)
		}
	}

	// ----------------- HTTP Routes -----------------
	lm := app.TemplateManager.LocalizationManager

	// Not found handler
	r.With(lm.EnableContextLanguage).NotFound(sys.NotFoundGET)

	// User handler
	r.With(lm.EnableContextLanguage).Get("/"+defs.RouteUser+"/{uid}", profilePage.ProfileGET)
	// Post handler
	r.With(lm.EnableContextLanguage).Get("/"+defs.RoutePost+"/{pid}", postPage.PostGET)
	// Dashboard handler
	r.With(lm.EnableContextLanguage).Mount("/"+defs.RouteDashboard, mp.Router)
	// Restricted Service handler (SR)
	r.Mount("/"+defs.RouteRestrictedService, sr.Router)

	debugConfig := config.Debug
	if debugConfig != nil {
		if debugConfig.QuickLogin {
			log.Print("⚠️ QuickLogin routes are on")
			r.Mount("/"+defs.RouteTest, t.Router)
		}
	}

	app.Logger.Info("server-starting", "port", httpConfig.Port)
	err := http.ListenAndServe(":"+strconv.Itoa(httpConfig.Port), r)
	if err != nil {
		app.Logger.Error("server-starting.failed", "err", err.Error())
		panic(err)
	}
}

// fileServer conveniently sets up a http.FileServer handler to serve
// static files from a http.FileSystem.
func fileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	fs := http.StripPrefix(path, http.FileServer(root))

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	}))
}
