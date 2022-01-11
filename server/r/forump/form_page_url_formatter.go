/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package forump

import "qing/a/appURL"

// ForumPageURLFormatter helps generate a forum page URL.
type ForumPageURLFormatter struct {
	ID  uint64
	Tab string
}

// NewForumPageURLFormatter creates a new ForumPageURLFormatter.
func NewForumPageURLFormatter(id uint64, tab string) *ForumPageURLFormatter {
	r := &ForumPageURLFormatter{ID: id, Tab: tab}
	return r
}

// GetURL returns the URL result.
func (formatter *ForumPageURLFormatter) GetURL(page int) string {
	return appURL.Get().ForumAdv(formatter.ID, formatter.Tab, page)
}
