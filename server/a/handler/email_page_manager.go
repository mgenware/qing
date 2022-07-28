/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"path/filepath"
	"qing/a/config"

	"qing/a/handler/localization"

	"github.com/mgenware/goutil/templatex"
)

// EmailPageManager is used to generate an email HTML page.
type EmailPageManager struct {
	dir  string
	conf *config.Config

	reloadViewsOnRefresh bool

	mainView PageTemplateType
	locMgr   localization.CoreManager
}

func MustCreateEmailPageManager(
	conf *config.Config,
) *EmailPageManager {
	reloadViewsOnRefresh := conf.Dev != nil && conf.Dev.ReloadViewsOnRefresh

	// Create the localization manager used by localized template views.
	locMgr, err := localization.NewManagerFromConfig(conf.Localization)
	if err != nil {
		panic(err)
	}

	t := &EmailPageManager{
		locMgr:               locMgr,
		conf:                 conf,
		reloadViewsOnRefresh: reloadViewsOnRefresh,
		dir:                  filepath.Join(conf.Templates.Dir, "email"),
	}

	// Load the main template.
	t.mainView = t.MustParseView("main.html")
	return t
}

func (m *EmailPageManager) LocalizationManager() localization.CoreManager {
	return m.locMgr
}

func (m *EmailPageManager) MustComplete(lang string, d *EmailPageData) string {
	if d == nil {
		panic("Unexpected nil `MainPageData` in `EmailPageManager.MustComplete`")
	}

	// Ensure lang always has a value.
	if lang == "" {
		lang = m.locMgr.FallbackLanguage()
	}

	// Add site name to title.
	d.Title = m.PageTitle(lang, d.Title)

	ls := m.locMgr.Dictionary(lang)
	d.LSSiteName = ls.SiteName
	d.LSSiteURL = ls.SiteUrl

	return m.mainView.MustExecuteToString(d)
}

// Unlike the `PageTitle` func in `MainPageManager`, we put site name before content title.
func (m *EmailPageManager) PageTitle(lang, s string) string {
	siteName := m.locMgr.Dictionary(lang).SiteName
	if s != "" {
		return siteName + " - " + s
	}
	return siteName
}

// MustParseView creates a new View with the given relative path.
func (m *EmailPageManager) MustParseView(relativePath string) PageTemplateType {
	file := filepath.Join(m.dir, relativePath)
	return templatex.MustParseView(file, m.reloadViewsOnRefresh)
}

// Dictionary returns a localized dictionary with the specified language ID.
func (m *EmailPageManager) Dictionary(lang string) *localization.Dictionary {
	return m.locMgr.Dictionary(lang)
}
