/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devmail

import (
	"errors"
	"os"
	"path/filepath"
	"qing/a/appConf"
	"qing/a/config/configs"
	"time"

	"github.com/mgenware/goutil/iox"
)

type DevMail struct {
	Title   string    `json:"title,omitempty"`
	Date    time.Time `json:"-"`
	Content string    `json:"content,omitempty"`
	TS      int64     `json:"ts,omitempty"`
}

func NewDevMail(title, content string, date time.Time) *DevMail {
	return &DevMail{Title: title, Content: content, Date: date, TS: date.Unix()}
}

func getDevConfig() (*configs.MailBoxConfig, error) {
	conf := appConf.Get()
	if conf.Dev == nil {
		return nil, errors.New("`ViewInboxDev` can only run in dev mode")
	}
	return conf.Dev.MailBox, nil
}

func ListUsers() ([]string, error) {
	conf, err := getDevConfig()
	if err != nil {
		return nil, err
	}

	devDir := conf.Dir
	dirObjs, err := os.ReadDir(devDir)
	if err != nil {
		return nil, err
	}

	var dirs []string
	for _, d := range dirObjs {
		dirs = append(dirs, d.Name())
	}
	return dirs, nil
}

// This returns a list of `DevMail` without `Content` set.
func ListMails(user string) ([]*DevMail, error) {
	conf, err := getDevConfig()
	if err != nil {
		return nil, err
	}

	devDir := conf.Dir
	userDir := filepath.Join(devDir, user)
	dirObjs, err := os.ReadDir(userDir)
	if err != nil {
		return nil, err
	}

	var mails []*DevMail
	for _, d := range dirObjs {
		tsString := d.Name()
		date := time.Parse()
		dirs = append(dirs, d.Name())
	}
	return dirs, nil
}

// `last` = 0: latest mail.
func GetMail(user string, last int) (*DevMail, error) {
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
