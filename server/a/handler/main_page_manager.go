/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"qing/a/appConf"
	"qing/a/appcom"
	"qing/a/conf"
	"qing/a/coretype"
	"qing/sod/authSod"

	"qing/a/handler/localization"

	"github.com/mgenware/goutil/httpx"
	"github.com/mgenware/goutil/templatex"
)

// Used by error page.
const coreScriptEntry = "core"

// MainPageManager is used to generate site main HTML page.
type MainPageManager struct {
	dir         string
	config      *conf.Config
	log404Error bool

	reloadViewsOnRefresh bool

	mainView  CoreLocalizedTemplate
	errorView CoreLocalizedTemplate
	asMgr     *AssetManager
	logger    coretype.CoreLogger
	lsMgr     localization.CoreManager
}

// MustCreateMainPageManager creates an instance of MainPageManager with the specified arguments. Note that this function panics when main template fails to load.
func MustCreateMainPageManager(
	config *conf.Config,
	logger coretype.CoreLogger,
	lsMgr localization.CoreManager,
) *MainPageManager {
	reloadViewsOnRefresh := config.Dev != nil && config.Dev.ReloadViewsOnRefresh

	asMgr := NewAssetManager(config.DevMode(), config.HTTP.Static.URL, config.HTTP.Static.Dir)

	t := &MainPageManager{
		lsMgr:                lsMgr,
		asMgr:                asMgr,
		logger:               logger,
		config:               config,
		reloadViewsOnRefresh: reloadViewsOnRefresh,
		dir:                  config.Templates.Dir,
		log404Error:          config.HTTP.Log404Error,
	}

	// Load the main template.
	t.mainView = t.MustParseLocalizedView("main.html")
	// Load the error template.
	t.errorView = t.MustParseLocalizedView("error.html")

	return t
}

func (m *MainPageManager) AssetManager() *AssetManager {
	return m.asMgr
}

func (m *MainPageManager) LocalizationManager() localization.CoreManager {
	return m.lsMgr
}

// MustCompleteWithContent finishes the response with the given HTML content.
func (m *MainPageManager) MustCompleteWithContent(content []byte, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)
	_, err := w.Write(content)
	if err != nil {
		panic(err)
	}
}

func (m *MainPageManager) MustComplete(r *http.Request, lang string, statusCode int, d *MainPageData, w http.ResponseWriter) {
	if d == nil {
		panic(fmt.Errorf("unexpected nil `MainPageData` in `MainPageManager.MustComplete`"))
	}

	ctx := r.Context()
	// Ensure lang always has a value.
	if lang == "" {
		lang = m.lsMgr.FallbackLanguage()
	}

	// Add site name to title.
	d.Title = m.PageTitle(lang, d.Title)

	// Setup additional assets.
	d.Lang = lang

	// `main.css` come before other header styles.
	d.Header = m.asMgr.MustGetStyle("mainEntry") + d.Header

	// Lang script comes before user scripts.
	d.Scripts = m.asMgr.MustGetLangScript(lang, "core") + d.Scripts

	// Sync settings.
	cfg := m.config
	d.State.PostPerm = cfg.Permissions.RawPost
	d.State.Forums = cfg.FourmsEnabled()
	d.State.InputType = cfg.Content.RawInputType

	// User info.
	user := appcom.ContextUser(ctx)
	if user != nil {
		userData := authSod.NewUser(user.EID, user.Name, user.Link, user.IconURL, user.Admin)
		d.State.User = &userData
	}

	// Compute internal fields.
	if d.Extra != nil {
		jsonBytes, err := json.Marshal(d.Extra)
		if err != nil {
			panic(err)
		}
		d.ZExtraJSON = string(jsonBytes)
	}
	jsonBytes, err := json.Marshal(d.State)
	if err != nil {
		panic(err)
	}
	d.ZStateJSON = string(jsonBytes)

	// Finalize HTTP response.
	// Get content string first as `MustExecute` might panic.
	contentHTML := m.mainView.MustExecuteToString(lang, d)

	// Any panics above are recovered by panic handler, which finalizes the response with 500 code.
	// If no panic happened, we are writing the designated status code and finalizing the response here.
	// Any panics below will trigger panic handler and thus set header status code again!
	// --------------------- No panic code below ---------------------
	// Write HTTP status code.
	w.WriteHeader(statusCode)
	// Write HTTP content type.
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)
	// Write HTTP content.
	_, err = fmt.Fprint(w, contentHTML)
	// The error here is defensive code. It should not happen in most cases.
	if err != nil {
		panic(err)
	}
}

// MustError executes the main view template with the specified data and panics if error occurs.
func (m *MainPageManager) MustError(r *http.Request, lang string, err error, statusCode int, w http.ResponseWriter) HTML {
	d := &ErrorPageData{Message: err.Error()}
	url := r.URL.String()
	if statusCode == http.StatusNotFound && appConf.Get().HTTP.Log404Error {
		m.logger.NotFound(url)
	} else if statusCode == http.StatusInternalServerError {
		m.logger.Error("page.fatal", "err", d.Message, "url", url)
	}
	errorHTML := m.errorView.MustExecuteToString(lang, d)
	mainPageData := NewMainPageData(m.Dictionary(lang).ErrOccurred, errorHTML)
	mainPageData.Scripts = m.AssetManager().MustGetScript(coreScriptEntry)
	m.MustComplete(r, lang, statusCode, &mainPageData, w)
	return HTML(0)
}

// PageTitle returns the given string followed by the localized site name.
func (m *MainPageManager) PageTitle(lang, s string) string {
	siteName := m.lsMgr.Dictionary(lang).QingSiteName
	if s != "" {
		return s + " - " + siteName
	}
	return siteName
}

// MustParseView creates a new View with the given relative path.
func (m *MainPageManager) MustParseView(templatePath string) CoreTemplate {
	file := filepath.Join(m.dir, templatePath)
	return templatex.MustParseView(file, m.reloadViewsOnRefresh)
}

// MustParseLocalizedView creates a new LocalizedView with the given relative path.
func (m *MainPageManager) MustParseLocalizedView(templatePath string) CoreLocalizedTemplate {
	file := filepath.Join(m.dir, templatePath)
	view := templatex.MustParseView(file, m.reloadViewsOnRefresh)
	return &LocalizedView{view: view, localizationManager: m.LocalizationManager()}
}

// Dictionary returns a localized dictionary with the specified language ID.
func (m *MainPageManager) Dictionary(lang string) *localization.Dictionary {
	return m.lsMgr.Dictionary(lang)
}
