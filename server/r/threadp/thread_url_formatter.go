/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package threadp

import "qing/a/appURL"

type ThreadURLFormatter struct {
	TID uint64
}

func NewQueURLFormatter(tid uint64) ThreadURLFormatter {
	r := ThreadURLFormatter{TID: tid}
	return r
}

// GetURL returns the URL result.
func (formatter ThreadURLFormatter) GetURL(page int) string {
	return appURL.Get().ThreadWithPage(formatter.TID, page)
}
