/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"io"
	"os"
	"path/filepath"

	"github.com/mgenware/goutil/iox"
)

// CopyReaderToFile writes the contents of the given reader to the specified file.
func CopyReaderToFile(reader io.Reader, file string) error {
	fileObj, err := os.Create(file)
	if err != nil {
		return err
	}
	defer fileObj.Close()
	_, err = io.Copy(fileObj, reader)
	if err != nil {
		return err
	}
	return nil
}

func WriteFile(file string, data []byte) error {
	dir := filepath.Dir(file)
	err := os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		return err
	}
	return os.WriteFile(file, data, iox.DefaultFilePerm)
}
