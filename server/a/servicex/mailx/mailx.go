/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mailx

import (
	"io/ioutil"
	"path/filepath"
	"qing/a/appLog"
	"qing/lib/iolib"
	"strconv"
	"time"
)

type MailService struct {
	devDir string
}

func NewMailService(devDir string) *MailService {
	ret := &MailService{}
	ret.devDir = devDir
	return ret
}

func (mn *MailService) Send(uid uint64, content string) (int64, error) {
	if mn.devDir != "" {
		now := time.Now()
		nsec := now.UnixNano()

		file := filepath.Join(mn.devDir, strconv.FormatUint(uid, 10), strconv.FormatInt(nsec, 10))
		err := ioutil.WriteFile(file, []byte(content), iolib.DefaultFileWritePerm)
		if err != nil {
			return 0, err
		}
		appLog.Get().Info("mail.sent", "uid", uid)
	}
	return 0, nil
}
