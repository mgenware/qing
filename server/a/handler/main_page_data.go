/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"qing/sod/appSod"
)

// MainPageData holds the data needed in main page template.
type MainPageData struct {
	LocalizedTemplateData

	Lang        string
	Title       string
	ContentHTML string
	Header      string
	Scripts     string

	// State gets serialized and passed to main page script section.
	State appSod.MainPageStateData

	// ExtraState gets serialized and passed to main page script section.
	ExtraState any

	// Members starts with a 'Z' prefix are used internally in `MainPageManager`.
	ZStateJSON string
	ZExtraJSON string
}

// NewMainPageData creates a new MainPageData.
func NewMainPageData(title, contentHTML string) MainPageData {
	return MainPageData{Title: title, ContentHTML: contentHTML}
}
