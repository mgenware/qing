/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /******************************************************************************************
  * Do not edit this file manually.
  * Automatically generated via `qing sod contentBase/contentBaseModelBase`.
  * See `lib/dev/sod/objects/contentBase/contentBaseModelBase.yaml` for details.
  ******************************************************************************************/

package contentBaseSod

type ContentBaseModelBase struct {
	URL         string `json:"url,omitempty"`
	UserURL     string `json:"userURL,omitempty"`
	UserIconURL string `json:"userIconURL,omitempty"`
	CreatedAt   string `json:"createdAt,omitempty"`
	ModifiedAt  string `json:"modifiedAt,omitempty"`
}

func NewContentBaseModelBase(url string, userURL string, userIconURL string, createdAt string, modifiedAt string) ContentBaseModelBase {
	return ContentBaseModelBase{
		URL: url,
		UserURL: userURL,
		UserIconURL: userIconURL,
		CreatedAt: createdAt,
		ModifiedAt: modifiedAt,
	}
}
