/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mailnoti

import (
	"io/ioutil"
	"path/filepath"
	"qing/lib/iolib"
	"strconv"
	"time"
)

type MailNoti struct {
	devDir string
}

func NewMailNoti(devDir string) *MailNoti {
	ret := &MailNoti{}
	ret.devDir = devDir
	return ret
}

func (mn *MailNoti) Send(uid uint64, content string) (int64, error) {
	if mn.devDir != "" {
		now := time.Now()
		nsec := now.UnixNano()

		file := filepath.Join(mn.devDir, strconv.FormatUint(uid, 10), strconv.FormatInt(nsec, 10))
		ioutil.WriteFile(file, []byte(content), iolib.DefaultFileWritePerm)
	}
	panic("not implemented")
}
