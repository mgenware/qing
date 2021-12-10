/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package qnap

import (
	"qing/app/appHandler"
)

var vQuestionPage = appHandler.MainPage().MustParseView("/qna/questionPage.html")

// QuestionPageModel ...
type QuestionPageModel struct {
	// Those props are used by template and thus not exposed in any API. No JSON keys attached.
	QuestionAppHTML string
	AnsListHTML     string
	PageBarHTML     string
}

// NewQuestionPageModel creates a QuestionPageModel.
func NewQuestionPageModel(queAppHTML, ansListHTML, pageBarHTML string) QuestionPageModel {
	d := QuestionPageModel{QuestionAppHTML: queAppHTML, AnsListHTML: ansListHTML, PageBarHTML: pageBarHTML}
	return d
}
