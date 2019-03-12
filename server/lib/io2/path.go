package io2

import (
	"os"
	"path"
	"strings"
	"time"
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

// TempFilePath returns a unique tmp file path (note the file is not created).
func TempFilePath(ext string) string {
	return path.Join(os.TempDir(), "-tmp-"+time.Now().Format("20060102150405"))
}
