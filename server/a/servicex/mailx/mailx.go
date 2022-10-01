/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mailx

import (
	"errors"
	"qing/a/servicex/mailx/devmail"
)

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
		err := devmail.SendMail(mn.devDir, to, title, content)
		if err != nil {
			return 0, err
		}
	}
	return 0, nil
}
