/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package devmail

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"qing/a/appEnv"
	"qing/a/cfgx/corecfg"
	"qing/a/coreConfig"
	"qing/lib/iolib"
	"qing/sod/dev/devSod"
	"sort"
	"strings"
	"time"

	"github.com/mgenware/goutil/iox"
)

const devTitleFile = "title.txt"
const devContentFile = "content.html"

func getDevConfig() (*corecfg.MailBoxConfig, error) {
	conf := coreConfig.Get()
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

func NewDevMail(id, title, content string) devSod.DevMail {
	date := mustParseDirTS(id)
	d := devSod.NewDevMail(id, title, content, int(date.UnixMilli()))
	return d
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
		email := d.Name()
		if !strings.Contains(email, "@") {
			continue
		}
		if !appEnv.IsBR() && strings.HasPrefix(email, "zzzTest-") {
			continue
		}
		dirs = append(dirs, d.Name())
	}
	return dirs, nil
}

// This returns a list of `DevMail` without `Content` set.
func ListMails(user string) ([]devSod.DevMail, error) {
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

	var mails []devSod.DevMail
	for _, d := range dirObjs {
		id := d.Name()
		titleFile := filepath.Join(userDir, id, devTitleFile)
		titleBytes, err := os.ReadFile(titleFile)
		if err != nil {
			return nil, err
		}
		mail := NewDevMail(id, string(titleBytes), "")
		mails = append(mails, mail)
	}

	sort.Slice(mails, func(i, j int) bool {
		return mails[i].TsMilli < mails[j].TsMilli
	})
	return mails, nil
}

// `index` = 0: latest mail.
// Instead of calling `ListMails`, this has its own implementation for better performance.
// It doesn't read mail titles like `ListMails`.
func GetLatestMail(user string, index int) (devSod.DevMail, error) {
	conf, err := getDevConfig()
	if err != nil {
		return devSod.DevMail{}, err
	}

	devDir := conf.Dir
	userDir := filepath.Join(devDir, user)
	mailDirs, err := os.ReadDir(userDir)
	if err != nil {
		return devSod.DevMail{}, err
	}

	// Sort by timestamp.
	sort.Slice(mailDirs, func(i, j int) bool {
		v1 := mustParseDirTS(mailDirs[i].Name())
		v2 := mustParseDirTS(mailDirs[j].Name())
		return v1.UnixMilli() < v2.UnixMilli()
	})

	if index >= len(mailDirs) || index < 0 {
		return devSod.DevMail{}, fmt.Errorf("invalid index: %v, valid range(0 - %v)", index, len(mailDirs)-1)
	}

	mailID := mailDirs[index].Name()
	mailDir := filepath.Join(userDir, mailID)

	titleFile := filepath.Join(mailDir, devTitleFile)
	contentFile := filepath.Join(mailDir, devContentFile)

	title, err := iox.ReadFileText(titleFile)
	if err != nil {
		return devSod.DevMail{}, err
	}

	content, err := iox.ReadFileText(contentFile)
	if err != nil {
		return devSod.DevMail{}, err
	}
	return NewDevMail(mailID, title, content), nil
}

func GetMail(user, id string) (devSod.DevMail, error) {
	conf, err := getDevConfig()
	if err != nil {
		return devSod.DevMail{}, err
	}

	devDir := conf.Dir
	userDir := filepath.Join(devDir, user)
	mailDir := filepath.Join(userDir, id)

	titleFile := filepath.Join(mailDir, devTitleFile)
	contentFile := filepath.Join(mailDir, devContentFile)

	title, err := iox.ReadFileText(titleFile)
	if err != nil {
		return devSod.DevMail{}, err
	}

	content, err := iox.ReadFileText(contentFile)
	if err != nil {
		return devSod.DevMail{}, err
	}
	return NewDevMail(id, title, content), nil
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

	err = iolib.WriteFile(titleFile, []byte(title))
	if err != nil {
		return err
	}

	err = iolib.WriteFile(contentFile, []byte(content))
	if err != nil {
		return err
	}
	return nil
}
