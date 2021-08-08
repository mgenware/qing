/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package homep

import "qing/app/appURL"

// HomePageURLFormatter helps generate a home page URL.
type HomePageURLFormatter struct {
	Tab string
}

// NewHomePageURLFormatter creates a HomePageURLFormatter.
func NewHomePageURLFormatter(tab string) HomePageURLFormatter {
	r := HomePageURLFormatter{Tab: tab}
	return r
}

// GetURL returns the URL result.
func (formatter HomePageURLFormatter) GetURL(page int) string {
	return appURL.Get().HomeAdv(formatter.Tab, page)
}
