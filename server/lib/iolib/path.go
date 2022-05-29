/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"path"
	"strings"
)

var supportedExtensions map[string]bool

func init() {
	supportedExtensions = map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
		".jfif": true,
	}
}

// IsImageFile checks if the specified path is an image.
func IsImageFile(p string) (bool, string) {
	ext := strings.ToLower(path.Ext(p))
	return supportedExtensions[ext], ext
}
