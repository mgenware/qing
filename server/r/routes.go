/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package r

import (
	"net/http"
	"qing/a/appHandler"
	"qing/a/appLog"
	"qing/a/appUserManager"
	"qing/a/coreConfig"
	"qing/a/def/appDef"
	"qing/a/handler"
	"qing/lib/iolib"
	"strconv"

	"qing/r/api"
	"qing/r/authp"
	"qing/r/devp"
	"qing/r/forump"
	"qing/r/fpostp"
	"qing/r/homep"
	"qing/r/mp"
	"qing/r/mxp"
	"qing/r/postp"
	"qing/r/profilep"
	"qing/r/sys"

	"github.com/go-chi/chi/v5"
	"github.com/mgenware/goutil/iox"
)

var r *chi.Mux

// Start starts the web router.
func Start() {
	r = chi.NewRouter()
	cfg := coreConfig.Get()
	httpConf := cfg.HTTP

	// ----------------- Middlewares -----------------
	// THE PanicMiddleware MUST BE AT THE VERY BEGINNING, OTHERWISE IT WILL NOT WORK!
	r.Use(sys.PanicMiddleware)
	// User session middleware.
	r.Use(appUserManager.Get().ParseUserSessionMiddleware)

	// ----------------- HTTP Routes -----------------
	// Not found handler.
	langRouter().NotFound(handler.HTMLHandlerToHTTPHandler(sys.NotFoundGET))

	// User router.
	langRouter().Get("/"+appDef.RouteUser+"/{uid}", handler.HTMLHandlerToHTTPHandler(profilep.GetProfile))
	// Post router.
	langRouter().Get("/"+appDef.RoutePost+"/{id}", handler.HTMLHandlerToHTTPHandler(postp.GetPost))
	// FPost router.
	langRouter().Get("/"+appDef.RouteForumPost+"/{id}", handler.HTMLHandlerToHTTPHandler(fpostp.GetFPost))
	// M (Management) router.
	langRouter().Mount("/"+appDef.RouteM, mp.Router)
	// MX (Admin management) router.
	langRouter().Mount("/"+appDef.RouteMx, mxp.Router)
	// Forum router.
	langRouter().Mount("/"+appDef.RouteForum, forump.Router)
	// Auth router.
	langRouter().Mount("/"+appDef.RouteAuth, authp.Router)
	// API router.
	r.Mount("/"+appDef.RouteApi, api.Router)
	// Home page.
	langRouter().Get("/", handler.HTMLHandlerToHTTPHandler(homep.HomeHandler))

	devConfig := cfg.Dev
	if devConfig != nil {
		// ======== DEV mode only setup ========

		// Mount static file server.
		httpStaticConf := httpConf.Static
		if httpStaticConf != nil {
			startFileServer(r, "static-server", httpStaticConf.URL, httpStaticConf.Dir)
		}

		// Mount resource server.
		rsConfig := cfg.ResServer
		if rsConfig != nil {
			startFileServer(r, "res-server", rsConfig.URL, rsConfig.Dir)
		}

		// Dev page.
		r.Mount("/"+appDef.RouteDev, devp.Router)

		// ======== End of DEV mode only setup ========
	}

	appLog.Get().Info("server.starting", "port", httpConf.Port)
	err := http.ListenAndServe(":"+strconv.Itoa(httpConf.Port), r)
	if err != nil {
		appLog.Get().Error("server.failed", "err", err.Error())
		panic(err)
	}
}

// Starts serving static files.
func startFileServer(r chi.Router, name, url, dir string) {
	appLog.Get().Info("fileserver.starting",
		"name", name,
		"url", url,
		"dir", dir,
	)
	iolib.AddFileServerHandler(r, url, http.Dir(dir))
	if !iox.IsDirectory(dir) {
		appLog.Get().Warn("fileserver.not-found", "name", name, "dir", dir)
	}
}

// Gets a router with context localization enabled.
func langRouter() chi.Router {
	if len(coreConfig.Get().Site.Langs) > 1 {
		return r.With(appHandler.MainPage().LocalizationManager().EnableContextLanguageMW)
	}
	return r
}
