/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod dev/dev`.
 * See `lib/dev/sod/objects/dev/dev.yaml` for details.
 ******************************************************************************************/

package devSod

type DevMail struct {
	ID      string `json:"id,omitempty"`
	Title   string `json:"title,omitempty"`
	Content string `json:"content,omitempty"`
	TsMilli int    `json:"tsMilli,omitempty"`
}

func NewDevMail(id string, title string, content string, tsMilli int) DevMail {
	return DevMail{
		ID: id,
		Title: title,
		Content: content,
		TsMilli: tsMilli,
	}
}
