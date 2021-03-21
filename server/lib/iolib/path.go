/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package iolib

import (
	"path"
	"strings"
)

// IsImagePath checks if the specified path is an image.
func IsImagePath(p string) (bool, string) {
	ext := path.Ext(p)
	ext = strings.ToLower(ext)
	if ext == ".jpg" || ext == ".jpeg" || ext == ".png" {
		return true, ext
	}
	return false, ext
}
