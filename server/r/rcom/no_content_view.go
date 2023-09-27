/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import "html"

func MustRunNoContentViewTemplateCore(content string) string {
	cHTML := ""
	if content != "" {
		cHTML = html.EscapeString(content)
	}
	return "<no-content-view>" + cHTML + "</no-content-view>"
}

func MustRunNoContentViewTemplate() string {
	return MustRunNoContentViewTemplateCore("")
}
