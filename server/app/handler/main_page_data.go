/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

// MainPageData holds the data needed in main page template.
type MainPageData struct {
	// User properties.
	Title       string
	ContentHTML string
	Header      string
	Scripts     string
	WindData    interface{}

	// HTML-complaint version of `AppLang`.
	AppHTMLLang string

	// Additional fields set in script area.
	AppUserID         string
	AppUserName       string
	AppUserURL        string
	AppUserIconURL    string
	AppUserAdmin      bool
	AppLang           string
	AppCommunityMode  bool
	AppWindDataString string
}

// This wraps a MainPageData and is used internally by template manager.
type MainPageDataWrapper struct {
}

// NewMainPageData creates a new MainPageData.
func NewMainPageData(title, contentHTML string) *MainPageData {
	return &MainPageData{Title: title, ContentHTML: contentHTML}
}
