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
	"qing/a/appConf"
	"qing/a/config/configs"

	"github.com/mgenware/goutil/iox"
)

type DevMail struct {
	Title   string `json:"title,omitempty"`
	Content string `json:"content,omitempty"`
}

func getDevConfig() (*configs.MailBoxConfig, error) {
	conf := appConf.Get()
	if conf.Dev == nil {
		return nil, errors.New("`ViewInboxDev` can only run in dev mode")
	}
	return conf.Dev.MailBox, nil
}

func GetDevMail(user string, idx int) (*DevMail, error) {
	conf, err := getDevConfig()
	if err != nil {
		return nil, err
	}

	devDir := conf.Dir
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

func EraseUser(user string) error {
	conf, err := getDevConfig()
	if err != nil {
		return err
	}

	devDir := conf.Dir
	userDir := filepath.Join(devDir, user)
	return os.RemoveAll(userDir)
}
