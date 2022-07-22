/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	appSod "qing/sod/app"
)

// MainPageData holds the data needed in main page template.
type MainPageData struct {
	// Inherited properties are shared between server and web via SOD.
	appSod.RawMainPageWind

	Title       string
	ContentHTML string
	Header      string
	Scripts     string
	WindData    any

	LSSiteName string
	LSSiteURL  string
}

// NewMainPageData creates a new MainPageData.
func NewMainPageData(title, contentHTML string) MainPageData {
	return MainPageData{Title: title, ContentHTML: contentHTML}
}
