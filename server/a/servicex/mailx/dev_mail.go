/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mailx

import (
	"errors"
	"os"
	"path/filepath"
	"qing/a/app"

	"github.com/mgenware/goutil/iox"
)

type DevMail struct {
	Title   string `json:"title,omitempty"`
	Content string `json:"content,omitempty"`
}

func GetDevMail(user string, idx int) (*DevMail, error) {
	conf := app.CoreConfig()
	if conf.Dev == nil {
		return nil, errors.New("`ViewInboxDev` can only run in dev mode")
	}

	devDir := conf.Dev.MailBox.Dir
	userDir := filepath.Join(devDir, user)
	mails, err := os.ReadDir(userDir)
	if err != nil {
		return nil, err
	}
	mailDirName := mails[idx].Name()
	mailDir := filepath.Join(userDir, mailDirName)

	titleFile := filepath.Join(mailDir, devTitleFile)
	contentFile := filepath.Join(mailDir, devContentFile)

	title, err := iox.ReadFileText(titleFile)
	if err != nil {
		return nil, err
	}

	content, err := iox.ReadFileText(contentFile)
	if err != nil {
		return nil, err
	}
	return &DevMail{Title: title, Content: content}, nil
}
