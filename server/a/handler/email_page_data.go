/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

type EmailPageData struct {
	Title       string
	PreviewText string
	ContentHTML string
	AppLang     string

	LSSiteName string
	LSSiteURL  string
}

func NewEmailPageData(title, previewText, contentHTML string) EmailPageData {
	return EmailPageData{Title: title, ContentHTML: contentHTML, PreviewText: previewText}
}
