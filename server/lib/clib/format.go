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
	return strconv.FormatUint(id, 36)
}

// Decodes the given string ID to an integer.
func DecodeID(str string) (uint64, error) {
	return strconv.ParseUint(str, 36, 64)
}

// Formats the given time to RFC3339 formart.
func TimeString(t time.Time) string {
	return t.Format(time.RFC3339)
}
