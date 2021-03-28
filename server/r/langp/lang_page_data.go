/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package langp

// LangInfo contains information about a language.
type LangInfo struct {
	ID            string
	Name          string
	LocalizedName string
}

// LangWindData passes page data to language settings page.
type LangWindData struct {
	Langs []LangInfo
}
