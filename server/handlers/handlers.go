package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"qing/app"
	"qing/fx/logx"
	"qing/handlers/errorPage"
	"qing/handlers/homePage"
	"qing/handlers/system"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/iox"
)

// Start starts the web router.
func Start() {
	r := chi.NewRouter()
	config := app.Config
	httpConfig := config.HTTP

	// ----------------- Middlewares -----------------
	// THE PanicMiddleware MUST BE AT THE VERY BEGINNING, OTHERWISE IT WILL NOT WORK!
	if !config.DevMode {
		// *** Production only ***

		// Mount PanicMiddleware only in production, let panic crash in development
		r.Use(system.PanicMiddleware)
	}

	// Mount static file server
	httpStaticConfig := httpConfig.Static
	if httpStaticConfig != nil {
		url := httpStaticConfig.URL
		dir := httpStaticConfig.Dir
		app.Logger.LogInfo("Serving Assets", logx.D{
			"url": url,
			"dir": dir,
		})
		fileServer(r, url, http.Dir(dir))
		if !iox.IsDirectory(dir) {
			app.Logger.LogWarning("Assets directory doesn't exist", logx.D{"dir": dir})
		}
	}

	// Mount resources server
	rsConfig := config.ResServer
	if rsConfig != nil {
		url := rsConfig.URL
		dir := rsConfig.Dir
		app.Logger.LogInfo("Serving Resource Server", logx.D{
			"url": url,
			"dir": dir,
		})
		fileServer(r, url, http.Dir(dir))
		if !iox.IsDirectory(dir) {
			app.Logger.LogWarning("Resource server directory doesn't exist", logx.D{"dir": dir})
		}
	}

	// Mount other middlewares, for example:
	// r.Use(sessionMiddleware)

	// ----------------- HTTP Routes -----------------
	lm := app.TemplateManager.LocalizationManager

	// Not found handler
	r.With(lm.EnableContextLanguage).NotFound(system.NotFoundHandler)

	// index handler
	r.With(lm.EnableContextLanguage).Get("/", homePage.HomeGET)
	r.With(lm.EnableContextLanguage).Get("/fakeError", errorPage.FakeErrorGET)

	app.Logger.LogInfo("Server starting", logx.D{"port": httpConfig.Port})
	err := http.ListenAndServe(":"+strconv.Itoa(httpConfig.Port), r)
	if err != nil {
		app.Logger.LogError("Server failed to start", logx.D{"err": err.Error()})
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
