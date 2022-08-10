/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"net/http"

	"qing/a/handler/localization"
)

type CorePageManager interface {
	MustCompleteWithContent(content []byte, w http.ResponseWriter)
	MustComplete(r *http.Request, lang string, statusCode int, d *MainPageData, w http.ResponseWriter)
	MustError(r *http.Request, lang string, err error, statusCode int, w http.ResponseWriter) HTML

	MustParseView(templatePath string) CoreTemplate
	MustParseLocalizedView(templatePath string) CoreLocalizedTemplate

	Dictionary(lang string) *localization.Dictionary
	PageTitle(lang, s string) string

	ScriptString(name string) string
	LocalizationManager() localization.CoreManager
}
