/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"
	"qing/app"
	"qing/app/appcom"
	"qing/app/config"

	"qing/app/handler/jsm"
	"qing/app/handler/localization"

	"github.com/mgenware/goutil/httpx"
	"github.com/mgenware/goutil/templatex"
)

// Used by error page.
const coreScriptEntry = "core"

// MainPageManager is used to generate site main HTML page.
type MainPageManager struct {
	dir         string
	conf        *config.Config
	log404Error bool

	reloadViewsOnRefresh bool

	mainView  PageTemplateType
	errorView PageTemplateType
	locMgr    localization.CoreManager
	jsMgr     *jsm.JSManager
	logger    app.CoreLog
}

// MustCreateMainPageManager creates an instance of MainPageManager with the specified arguments. Note that this function panics when main template fails to load.
func MustCreateMainPageManager(
	conf *config.Config,
	logger app.CoreLog,
) *MainPageManager {
	reloadViewsOnRefresh := conf.Debug != nil && conf.Debug.ReloadViewsOnRefresh
	if reloadViewsOnRefresh {
		log.Print("😡 View dev mode is on")
	}

	// Create the localization manager used by localized template views.
	locMgr, err := localization.NewManagerFromConfig(conf.Localization)
	if err != nil {
		panic(err)
	}

	jsMgr := jsm.NewJSManager(conf.DevMode())

	t := &MainPageManager{
		locMgr:               locMgr,
		jsMgr:                jsMgr,
		logger:               logger,
		conf:                 conf,
		reloadViewsOnRefresh: reloadViewsOnRefresh,
	}
	t.dir = conf.Templates.Dir
	t.log404Error = conf.HTTP.Log404Error

	// Load the main template.
	t.mainView = t.MustParseView("main.html")
	// Load the error template.
	t.errorView = t.MustParseView("error.html")

	return t
}

func (m *MainPageManager) ScriptString(name string) string {
	return m.jsMgr.ScriptString(name)
}

func (m *MainPageManager) LocalizationManager() localization.CoreManager {
	return m.locMgr
}

// MustCompleteWithContent finished the response with the given HTML content.
func (m *MainPageManager) MustCompleteWithContent(content []byte, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)
	w.Write(content)
}

// MustComplete executes the main view template with the specified data and panics if error occurs.
func (m *MainPageManager) MustComplete(r *http.Request, lang string, d *MainPageData, w http.ResponseWriter) {
	if d == nil {
		panic("Unexpected empty `MainPageData` in `MustComplete`")
	}
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)

	ctx := r.Context()
	// Ensure lang always has a value
	if lang == "" {
		lang = m.locMgr.FallbackLanguage()
	}

	// Add site name to title
	d.Title = m.PageTitle(lang, d.Title)

	// Setup additional assets
	d.AppLang = lang
	if d.WindData != nil {
		jsonBytes, _ := json.Marshal(d.WindData)
		d.AppWindDataString = string(jsonBytes)
	}

	// Lang script comes before user scripts
	d.Scripts = m.jsMgr.LangScriptString(lang) + d.Scripts

	// User info
	user := appcom.ContextUser(ctx)
	if user != nil {
		d.AppUserID = user.EID
		d.AppUserName = user.Name
		d.AppUserIconURL = user.IconURL
		d.AppUserURL = user.URL
		d.AppUserAdmin = user.Admin
	}

	m.mainView.MustExecute(w, d)
}

// MustError executes the main view template with the specified data and panics if error occurs.
func (m *MainPageManager) MustError(r *http.Request, lang string, err error, expected bool, w http.ResponseWriter) HTML {
	d := &ErrorPageData{Message: err.Error()}
	// Handle unexpected errors
	if !expected {
		if err == sql.ErrNoRows {
			// Consider `sql.ErrNoRows` as 404 not found error
			w.WriteHeader(http.StatusNotFound)
			// Set `expected` to `true`
			expected = true

			d.Message = m.Dictionary(lang).ResourceNotFound
			if m.conf.HTTP.Log404Error {
				m.logger.NotFound("DB", r.URL.String())
			}
		} else {
			// At this point, this should be a 500 server internal error
			w.WriteHeader(http.StatusInternalServerError)
			m.logger.Error("fatal-error", "msg", d.Message)
		}
	}
	errorHTML := m.errorView.MustExecuteToString(d)
	htmlData := NewMainPageData(m.Dictionary(lang).ErrOccurred, errorHTML)
	htmlData.Scripts = m.ScriptString(coreScriptEntry)
	m.MustComplete(r, lang, htmlData, w)
	return HTML(0)
}

// PageTitle returns the given string followed by the localized site name.
func (m *MainPageManager) PageTitle(lang, s string) string {
	siteName := m.locMgr.Dictionary(lang).SiteName
	if s != "" {
		return s + " - " + siteName
	}
	return siteName
}

// MustParseView creates a new View with the given relative path.
func (m *MainPageManager) MustParseView(relativePath string) PageTemplateType {
	file := filepath.Join(m.dir, relativePath)
	return templatex.MustParseView(file, m.reloadViewsOnRefresh)
}

// Dictionary returns a localized dictionary with the specified language ID.
func (m *MainPageManager) Dictionary(lang string) *localization.Dictionary {
	return m.locMgr.Dictionary(lang)
}
