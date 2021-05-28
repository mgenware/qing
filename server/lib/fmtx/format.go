/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package fmtx

import (
	"strconv"
	"time"
)

// EncodeID encodes the given integer ID to a string.
func EncodeID(id uint64) string {
	return strconv.FormatUint(id, 36)
}

// DecodeID decodes the given string ID to an integer.
func DecodeID(str string) (uint64, error) {
	return strconv.ParseUint(str, 36, 64)
}

// Time formats the given time to RFC3339 formart.
func Time(t time.Time) string {
	return t.Format(time.RFC3339)
}
