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
	"qing/a/appLog"
	"qing/lib/iolib"
	"strconv"
	"time"

	"github.com/mgenware/goutil/iox"
)

type MailService struct {
	devDir string
}

func NewMailService(devDir string) *MailService {
	ret := &MailService{}
	ret.devDir = devDir
	return ret
}

func (mn *MailService) Send(to, content string) (int64, error) {
	if to == "" {
		return 0, errors.New("empty \"to\" field in mail-send")
	}
	// Ddv mode?
	if mn.devDir != "" {
		now := time.Now()
		nsec := now.UnixNano()

		dir := filepath.Join(mn.devDir, to)
		err := iox.Mkdirp(dir)
		if err != nil {
			return 0, err
		}

		file := filepath.Join(dir, strconv.FormatInt(nsec, 10)) + ".html"
		err = ioutil.WriteFile(file, []byte(content), iolib.DefaultFileWritePerm)
		if err != nil {
			return 0, err
		}
		appLog.Get().Info("mail.sent", "to", to)
	}
	return 0, nil
}
