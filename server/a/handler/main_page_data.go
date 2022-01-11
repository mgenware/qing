/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import "qing/sod/app/rawMainPageWind"

// MainPageData holds the data needed in main page template.
type MainPageData struct {
	// Inherited properties are shared between server and web via SOD.
	rawMainPageWind.RawMainPageWind

	Title       string
	ContentHTML string
	Header      string
	Scripts     string
	WindData    interface{}
}

// NewMainPageData creates a new MainPageData.
func NewMainPageData(title, contentHTML string) *MainPageData {
	return &MainPageData{Title: title, ContentHTML: contentHTML}
}
