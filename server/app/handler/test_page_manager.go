/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"encoding/json"
	"net/http"
	"path/filepath"
	"qing/app"
	"qing/app/appcom"
	"qing/app/config"

	"qing/app/handler/localization"

	"github.com/mgenware/go-packagex/v6/httpx"
	"github.com/mgenware/go-packagex/v6/templatex"
)

// TestPageManager is used to generate site main HTML page.
type TestPageManager struct {
	conf      *config.Config
	mainView  PageTemplateType
	errorView PageTemplateType
	logger    app.CoreLog

	locMgr localization.CoreManager
}

func MustCreateTestPageManager(
	conf *config.Config,
	logger app.CoreLog,
) *TestPageManager {
	locMgr, err := localization.NewTestManagerFromConfig(conf.Localization)
	if err != nil {
		panic(err)
	}

	t := &TestPageManager{
		locMgr: locMgr,
		logger: logger,
		conf:   conf,
	}
	t.mainView = t.MustParseView("main_test.txt")
	t.errorView = t.MustParseView("error.html")
	return t
}

func (m *TestPageManager) ScriptString(name string) string {
	return "<script." + name + ">"
}

func (m *TestPageManager) LocalizationManager() localization.CoreManager {
	return m.locMgr
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
		lang = m.locMgr.FallbackLanguage()
	}

	// Add site name to title
	d.Title = m.PageTitle(lang, d.Title)

	d.AppLang = lang
	d.AppForumsMode = m.conf.Setup.ForumsMode
	d.AppHTMLLang = lang
	if d.WindData != nil {
		jsonBytes, _ := json.Marshal(d.WindData)
		d.AppWindDataString = string(jsonBytes)
	}

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
	panic("Not supported")
}

// PageTitle returns the given string followed by the localized site name.
func (m *TestPageManager) PageTitle(lang, s string) string {
	siteName := m.locMgr.Dictionary(lang).SiteName
	if s != "" {
		return s + " - " + siteName
	}
	return siteName
}

// MustParseView creates a new View with the given relative path.
func (m *TestPageManager) MustParseView(relativePath string) PageTemplateType {
	file := filepath.Join(m.conf.Templates.Dir, relativePath)
	return templatex.MustParseView(file, false)
}

// Dictionary returns a localized dictionary with the specified language ID.
func (m *TestPageManager) Dictionary(lang string) *localization.Dictionary {
	panic("Not supported")
}
