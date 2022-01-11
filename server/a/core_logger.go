/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package app

type CoreLogger interface {
	Info(key string, args ...interface{})
	Error(key string, args ...interface{})
	Warn(key string, args ...interface{})
	NotFound(key string, url string)
}
