/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package qnap

import "qing/a/appURL"

// QueURLFormatter ...
type QueURLFormatter struct {
	QID uint64
}

// NewQueURLFormatter creates a QueURLFormatter.
func NewQueURLFormatter(qid uint64) QueURLFormatter {
	r := QueURLFormatter{QID: qid}
	return r
}

// GetURL returns the URL result.
func (formatter QueURLFormatter) GetURL(page int) string {
	return appURL.Get().QuestionWithPage(formatter.QID, page)
}
