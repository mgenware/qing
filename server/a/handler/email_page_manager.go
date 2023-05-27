/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"fmt"
	"path/filepath"

	"qing/a/cfgx"
	"qing/a/handler/localization"

	"github.com/mgenware/goutil/templatex"
)

// EmailPageManager is used to generate an email HTML page.
type EmailPageManager struct {
	dir    string
	config *cfgx.CoreConfig

	reloadViewsOnRefresh bool

	mainView CoreTemplate
	lsMgr    localization.CoreManager
}

func MustCreateEmailPageManager(
	cc *cfgx.CoreConfig,
	lsMgr localization.CoreManager,
) *EmailPageManager {
	reloadViewsOnRefresh := cc.Dev != nil && cc.Dev.ReloadViewsOnRefresh

	t := &EmailPageManager{
		lsMgr:                lsMgr,
		config:               cc,
		reloadViewsOnRefresh: reloadViewsOnRefresh,
		dir:                  filepath.Join(cc.Templates.Dir, "email"),
	}

	// Load the main template.
	t.mainView = t.MustParseView("main.html")
	return t
}

func (m *EmailPageManager) LocalizationManager() localization.CoreManager {
	return m.lsMgr
}

func (m *EmailPageManager) MustComplete(lang string, d *EmailPageData) (string, string) {
	if d == nil {
		panic(fmt.Errorf("unexpected nil `MainPageData` in `EmailPageManager.MustComplete`"))
	}

	// Ensure lang always has a value.
	if lang == "" {
		lang = m.lsMgr.FallbackLanguage()
	}

	d.AppLang = lang

	ls := m.lsMgr.Dictionary(lang)
	d.LSSiteName = ls.QingSiteName
	d.LSSiteLink = ls.QingSiteLink

	return m.mainView.MustExecuteToString(d), d.Title
}

// MustParseView creates a new View with the given relative path.
func (m *EmailPageManager) MustParseView(relativePath string) CoreTemplate {
	file := filepath.Join(m.dir, relativePath)
	return templatex.MustParseView(file, m.reloadViewsOnRefresh)
}

// Dictionary returns a localized dictionary with the specified language ID.
func (m *EmailPageManager) Dictionary(lang string) *localization.Dictionary {
	return m.lsMgr.Dictionary(lang)
}
