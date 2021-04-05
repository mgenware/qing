/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"qing/app"
	"qing/app/appcom"
	"qing/app/config"
	txt "text/template"

	"qing/app/handler/assetmgr"
	"qing/app/handler/localization"

	"github.com/mgenware/go-packagex/v6/httpx"
)

// TestPageManager is used to generate site main HTML page.
type TestPageManager struct {
	conf      *config.Config
	mainView  *TestTemplate
	errorView *TestTemplate
	logger    app.CoreLog

	LocalizationManager localization.CoreManager
	AssetsManager       *assetmgr.AssetsManager
}

func MustCreateTestPageManager(
	conf *config.Config,
	assetMgr *assetmgr.AssetsManager,
	logger app.CoreLog,
) *TestPageManager {
	localizationManager, err := localization.NewTestManagerFromConfig(conf.Localization)
	if err != nil {
		panic(err)
	}

	t := &TestPageManager{
		LocalizationManager: localizationManager,
		AssetsManager:       assetMgr,
		logger:              logger,
		conf:                conf,
		errorView:           NewTestTemplate("error"),
		mainView:            NewTestTemplate("main"),
	}
	return t
}

// MustCompleteWithContent finished the response with the given HTML content.
func (m *TestPageManager) MustCompleteWithContent(content []byte, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)
	w.Write(content)
}

// MustComplete executes the main view template with the specified data and panics if error occurs.
func (m *TestPageManager) MustComplete(r *http.Request, lang string, d *MainPageData, w http.ResponseWriter) {
	if d == nil {
		panic("Unexpected empty `MainPageData` in `MustComplete`")
	}
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)

	ctx := r.Context()
	// Ensure lang always has a value
	if lang == "" {
		lang = m.LocalizationManager.FallbackLanguage()
	}

	// Add site name to title
	d.Title = m.PageTitle(lang, d.Title)

	// Setup additional assets
	assetsMgr := m.AssetsManager
	js := assetsMgr.JS

	d.Header = d.Header
	d.AppLang = lang
	d.AppForumsMode = m.conf.Setup.ForumsMode
	d.AppHTMLLang = lang
	if d.WindData != nil {
		jsonBytes, _ := json.Marshal(d.WindData)
		d.AppWindDataString = string(jsonBytes)
	}

	script := ""
	// Language file, this should be loaded first as the main.js relies on it.
	if m.conf.Debug != nil {
		// Read the JSON content and inject it to main page in dev mode.
		jsonFileName := fmt.Sprintf("%v.json", lang)
		jsonFile := filepath.Join(m.conf.Localization.Dir, jsonFileName)
		jsonBytes, err := os.ReadFile(jsonFile)
		if err != nil {
			panic(err) // can panic in dev mode
		}
		var buffer bytes.Buffer
		err = json.Compact(&buffer, jsonBytes)
		if err != nil {
			panic(err) // can panic in dev mode
		}
		script += "<script>window.ls=JSON.parse(\"" + txt.JSEscapeString(buffer.String()) + "\")</script>"
	}

	// Main JS files
	script += js.Loader + js.Polyfills + js.Main

	// System scripts come before user scripts
	d.Scripts = script + d.Scripts

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
func (m *TestPageManager) MustError(r *http.Request, lang string, err error, expected bool, w http.ResponseWriter) HTML {
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
				m.logger.NotFound("sql", r.URL.String())
			}
		} else {
			// At this point, this should be a 500 server internal error
			w.WriteHeader(http.StatusInternalServerError)
			m.logger.Error("fatal-error", "msg", d.Message)
		}
	}
	errorHTML := m.errorView.MustExecuteToString(d)
	htmlData := NewMainPageData(m.Dictionary(lang).ErrOccurred, errorHTML)
	m.MustComplete(r, lang, htmlData, w)
	return HTML(0)
}

// PageTitle returns the given string followed by the localized site name.
func (m *TestPageManager) PageTitle(lang, s string) string {
	siteName := m.LocalizationManager.Dictionary(lang).SiteName
	if s != "" {
		return s + " - " + siteName
	}
	return siteName
}

// MustParseView creates a new View with the given relative path.
func (m *TestPageManager) MustParseView(relativePath string) PageTemplateType {
	return NewTestTemplate(relativePath)
}

// Dictionary returns a localized dictionary with the specified language ID.
func (m *TestPageManager) Dictionary(lang string) *localization.Dictionary {
	return m.LocalizationManager.Dictionary(lang)
}
