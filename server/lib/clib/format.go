/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import (
	"strconv"
	"time"
)

// Encodes the given integer ID to a string.
func EncodeID(id uint64) string {
	if id == 0 {
		return ""
	}
	return strconv.FormatUint(id, 36)
}

// Decodes the given string ID to an integer.
func DecodeID(str string) (uint64, error) {
	if str == "" {
		return uint64(0), nil
	}
	return strconv.ParseUint(str, 36, 64)
}

// Formats the given time to RFC3339 format.
func TimeString(t time.Time) string {
	return t.Format(time.RFC3339)
}

func ParseTime(s string) (time.Time, error) {
	return time.Parse(time.RFC3339, s)
}

func ParseTimestampMilli(s string) (time.Time, error) {
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return time.Time{}, err
	}
	return time.UnixMilli(i), nil
}
