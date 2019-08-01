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
