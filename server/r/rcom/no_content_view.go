/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"encoding/json"
	"qing/a/appcm"
)

func MustRunNoContentViewTemplateCore(content string) string {
	attr := ""
	if content != "" {
		bytes, err := json.Marshal(content)
		if err != nil {
			appcm.PanicOn(err, "Failed to marshal content")
		}
		attr = " message=" + string(bytes)
	}
	return "<no-content-view" + attr + "></no-content-view>"
}

func MustRunNoContentViewTemplate() string {
	return MustRunNoContentViewTemplateCore("")
}
