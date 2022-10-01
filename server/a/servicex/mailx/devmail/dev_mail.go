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
	"sort"
	"time"

	"github.com/mgenware/goutil/iox"
)

const devTitleFile = "title.txt"
const devContentFile = "content.html"

type DevMail struct {
	Title   string    `json:"title,omitempty"`
	Date    time.Time `json:"-"`
	Content string    `json:"content,omitempty"`
	// Example: 2022-08-06T172921.594824688Z
	DirName string `json:"dirName,omitempty"`
	TS      int64  `json:"ts,omitempty"`
}

func getDevConfig() (*configs.MailBoxConfig, error) {
	conf := appConf.Get()
	if conf.Dev == nil {
		return nil, errors.New("`ViewInboxDev` can only run in dev mode")
	}
	return conf.Dev.MailBox, nil
}

func parseDirTS(s string) (time.Time, error) {
	date, err := time.Parse(time.RFC3339Nano, s)
	if err != nil {
		return time.Time{}, err
	}
	return date, nil
}

func mustParseDirTS(s string) time.Time {
	date, err := parseDirTS(s)
	if err != nil {
		panic(err)
	}
	return date
}

func NewDevMail(title, content, dirName string) *DevMail {
	date := mustParseDirTS(dirName)
	return &DevMail{Title: title, Content: content, Date: date, TS: date.Unix(), DirName: dirName}
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
		dirName := d.Name()
		titleFile := filepath.Join(userDir, dirName, devTitleFile)
		titleBytes, err := os.ReadFile(titleFile)
		if err != nil {
			return nil, err
		}
		mail := NewDevMail(string(titleBytes), "", dirName)
		mails = append(mails, mail)
	}

	sort.Slice(mails, func(i, j int) bool {
		return mails[i].TS < mails[j].TS
	})
	return mails, nil
}

// `last` = 0: latest mail.
// Instead of calling `ListMails`, this has its own implementation for better performance.
// It doesn't read mail titles like `ListMails`.
func GetLastMail(user string, last int) (*DevMail, error) {
	conf, err := getDevConfig()
	if err != nil {
		return nil, err
	}

	devDir := conf.Dir
	userDir := filepath.Join(devDir, user)
	mailDirs, err := os.ReadDir(userDir)
	if err != nil {
		return nil, err
	}

	// Sort by timestamp.
	sort.Slice(mailDirs, func(i, j int) bool {
		v1 := mustParseDirTS(mailDirs[i].Name())
		v2 := mustParseDirTS(mailDirs[j].Name())
		return v1.UnixMilli() < v2.UnixMilli()
	})

	mailDirName := mailDirs[last].Name()
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

func GetMail(user, dirName string) (*DevMail, error) {
	conf, err := getDevConfig()
	if err != nil {
		return nil, err
	}

	devDir := conf.Dir
	userDir := filepath.Join(devDir, user)
	mailDir := filepath.Join(userDir, dirName)

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

func SendMail(devDir, to, title, content string) error {
	toDir := filepath.Join(devDir, to)
	err := iox.Mkdirp(toDir)
	if err != nil {
		return err
	}

	timeStr := time.Now().Format(time.RFC3339Nano)
	curDir := filepath.Join(toDir, timeStr)
	err = iox.Mkdirp(curDir)
	if err != nil {
		return err
	}

	titleFile := filepath.Join(curDir, devTitleFile)
	contentFile := filepath.Join(curDir, devContentFile)

	err = os.WriteFile(titleFile, []byte(title), iox.DefaultFilePerm)
	if err != nil {
		return err
	}

	err = os.WriteFile(contentFile, []byte(content), iox.DefaultFilePerm)
	if err != nil {
		return err
	}
	return nil
}