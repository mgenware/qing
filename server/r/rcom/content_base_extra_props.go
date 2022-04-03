/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

type ContentBaseExtraProps struct {
	URL         string `json:"url"`
	UserURL     string `json:"userURL"`
	UserIconURL string `json:"userIconURL"`
	CreatedAt   string `json:"createdAt"`
	ModifiedAt  string `json:"modifiedAt"`
}
