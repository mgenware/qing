/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mailx

import (
	"errors"
	"io/ioutil"
	"path/filepath"
	"time"

	"github.com/mgenware/goutil/iox"
)

const devTitleFile = "title.txt"
const devContentFile = "content.html"

type MailService struct {
	devDir string
}

func NewMailService(devDir string) *MailService {
	ret := &MailService{}
	ret.devDir = devDir
	return ret
}

func (mn *MailService) Send(to, title, content string) (int64, error) {
	if to == "" {
		return 0, errors.New("empty \"to\" field in mail-send")
	}
	// Write to file system in dev mode.
	if mn.devDir != "" {
		toDir := filepath.Join(mn.devDir, to)
		err := iox.Mkdirp(toDir)
		if err != nil {
			return 0, err
		}

		timeStr := time.Now().Format(time.RFC3339)
		curDir := filepath.Join(toDir, timeStr)
		err = iox.Mkdirp(curDir)
		if err != nil {
			return 0, err
		}

		titleFile := filepath.Join(curDir, devTitleFile)
		contentFile := filepath.Join(curDir, devContentFile)

		err = ioutil.WriteFile(titleFile, []byte(title), iox.DefaultFilePerm)
		if err != nil {
			return 0, err
		}

		err = ioutil.WriteFile(contentFile, []byte(content), iox.DefaultFilePerm)
		if err != nil {
			return 0, err
		}
	}
	return 0, nil
}
