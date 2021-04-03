/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package captchax

import (
	"bytes"
	"fmt"
	"io"
	"qing/app"
	"qing/app/defs"
	"strconv"

	"github.com/mgenware/go-captcha"
)

const ResultVerified = 1
const ResultNotVerified = -1

type CaptchaService struct {
	msStore app.CoreMemoryStore
}

var allowedTypes map[int]bool

func init() {
	allowedTypes = make(map[int]bool)
	allowedTypes[defs.Shared.EntityPost] = true
	allowedTypes[defs.Shared.EntityCmt] = true
	allowedTypes[defs.Shared.EntityReply] = true
	allowedTypes[defs.Shared.EntityDiscussion] = true
	allowedTypes[defs.Shared.EntityDiscussionMsg] = true
}

// NewCaptchaService creates a CaptchaService.
func NewCaptchaService(msStore app.CoreMemoryStore) *CaptchaService {
	return &CaptchaService{msStore: msStore}
}

// IsTypeAllowed determines if the specified entity type is allowed in this service.
func (c *CaptchaService) IsTypeAllowed(entityType int) bool {
	return allowedTypes[entityType]
}

// WriteCaptcha flushes a captcha image generated by the given parameters to the specified io.Writer.
func (c *CaptchaService) WriteCaptcha(uid uint64, entityType int, length int, w io.Writer) error {
	code := captcha.RandomDigits(length)
	codeStr := c.bytesToString(code)
	err := c.registerCaptcha(uid, entityType, codeStr)
	if err != nil {
		return err
	}
	img := captcha.NewImage("", code, 150, 45)
	_, err = img.WriteTo(w)
	if err != nil {
		return err
	}
	return nil
}

// Verify checks if the specified code matches the internal code stored in memory.
func (c *CaptchaService) Verify(uid uint64, entityType int, code string, devMode bool) (int, error) {
	msConn := c.msStore.GetConn()
	// Expected way to bypass captcha verification process on dev mode.
	if devMode {
		return 0, nil
	}
	key := c.getMSKey(uid, entityType)
	result, err := msConn.GetStringValue(key)
	if err != nil {
		return 0, err
	}
	if result == "" {
		return defs.Shared.ErrCaptchaNotFound, nil
	}
	if result != code {
		return defs.Shared.ErrCaptchaNotMatch, nil
	}
	return 0, nil
}

func (c *CaptchaService) getMSKey(uid uint64, entityType int) string {
	return fmt.Sprintf(defs.MSCaptcha, uid, entityType)
}

func (c *CaptchaService) registerCaptcha(uid uint64, category int, value string) error {
	msConn := c.msStore.GetConn()
	key := c.getMSKey(uid, category)
	return msConn.SetStringValue(key, value, defs.MSCaptchaTimeout)
}

// Converts bytes from `captcha.RandomDigits` to a string.
func (c *CaptchaService) bytesToString(digits []byte) string {
	var buffer bytes.Buffer
	for _, d := range digits {
		buffer.WriteString(strconv.Itoa(int(d)))
	}
	return buffer.String()
}
