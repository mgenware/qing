/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package r

import (
	"log"
	"net/http"
	"qing/app/appLog"
	"qing/app/cfg"
	"qing/app/defs"
	"qing/app/handler"
	"strconv"
	"strings"

	"qing/app"
	"qing/r/api"
	"qing/r/authp"
	"qing/r/devpagep"
	"qing/r/discussionp"
	"qing/r/forump"
	"qing/r/homep"
	"qing/r/langp"
	"qing/r/mp"
	"qing/r/mxp"
	"qing/r/postp"
	"qing/r/profilep"
	"qing/r/qnap"
	"qing/r/sys"

	"github.com/go-chi/chi"
	"github.com/mgenware/go-packagex/v5/iox"
)

var r *chi.Mux
var appConfig *cfg.Config

func startFileServer(r chi.Router, name, url, dir string) {
	appLog.Get().Info(name,
		"url", url,
		"dir", dir,
	)
	fileServer(r, url, http.Dir(dir))
	if !iox.IsDirectory(dir) {
		appLog.Get().Warn(name+".not-found", "dir", dir)
	}
}

// Start starts the web router.
func Start() {
	r = chi.NewRouter()
	appConfig = app.Config
	httpConfig := appConfig.HTTP

	// ----------------- Middlewares -----------------
	// THE PanicMiddleware MUST BE AT THE VERY BEGINNING, OTHERWISE IT WILL NOT WORK!
	r.Use(sys.PanicMiddleware)
	// User session middleware.
	r.Use(app.UserManager.SessionManager.ParseUserSessionMiddleware)

	// Mount static file server.
	httpStaticConfig := httpConfig.Static
	if httpStaticConfig != nil {
		startFileServer(r, "static-server", httpStaticConfig.URL, httpStaticConfig.Dir)
	}

	// Mount resource server.
	rsConfig := appConfig.ResServer
	if rsConfig != nil {
		startFileServer(r, "res-server", rsConfig.URL, rsConfig.Dir)
	}

	// ----------------- HTTP Routes -----------------
	// Not found handler.
	langRouter().NotFound(handler.HTMLHandlerToHTTPHandler(sys.NotFoundGET))

	// User router.
	langRouter().Get("/"+defs.Shared.RouteUser+"/{uid}", handler.HTMLHandlerToHTTPHandler(profilep.GetProfile))
	// Post router.
	langRouter().Get("/"+defs.Shared.RoutePost+"/{pid}", handler.HTMLHandlerToHTTPHandler(postp.GetPost))
	// Question router.
	langRouter().Get("/"+defs.Shared.RouteQuestion+"/{qid}", handler.HTMLHandlerToHTTPHandler(qnap.GetQuestion))
	// Discussion router.
	langRouter().Get("/"+defs.Shared.RouteDiscussion+"/{tid}", handler.HTMLHandlerToHTTPHandler(discussionp.GetDiscussion))
	// M (Management) router.
	langRouter().Mount("/"+defs.Shared.RouteM, mp.Router)
	// MX (Admin management) router.
	langRouter().Mount("/"+defs.Shared.RouteMx, mxp.Router)
	// Forum router.
	langRouter().Mount("/"+defs.Shared.RouteForum, forump.Router)
	// Auth router.
	langRouter().Mount("/"+defs.Shared.RouteAuth, authp.Router)
	// API router.
	r.Mount("/"+defs.Shared.RouteApi, api.Router)
	// Home page.
	r.Get("/", handler.HTMLHandlerToHTTPHandler(homep.HomeHandler))
	// Language settings router.
	langRouter().Mount("/"+defs.Shared.RouteLang, handler.HTMLHandlerToHTTPHandler(langp.LangHandler))

	debugConfig := appConfig.Debug
	if debugConfig != nil {
		// DEBUG only setup.
		if debugConfig.QuickLogin {
			log.Print("⚠️ QuickLogin routes are on")
			r.Mount("/"+defs.Shared.RouteDevPage, devpagep.Router)
		}
	}

	appLog.Get().Info("server-starting", "port", httpConfig.Port)
	err := http.ListenAndServe(":"+strconv.Itoa(httpConfig.Port), r)
	if err != nil {
		appLog.Get().Error("server-starting.failed", "err", err.Error())
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

func langRouter() chi.Router {
	if appConfig.Localization.MultipleLangs() {
		return r.With(app.MainPageManager.LocalizationManager.EnableContextLanguageMW)
	}
	return r
}
