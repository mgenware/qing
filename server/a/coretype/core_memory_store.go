/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package coretype

import "time"

type CoreMemoryStoreConn interface {
	Ping() error
	Exist(key string) (bool, error)
	GetStringValue(key string) (string, error)
	SetStringValue(key string, val string, expiry time.Duration) error
	RemoveValue(key string) error
	Destroy() error
}

type CoreMemoryStore interface {
	GetConn() CoreMemoryStoreConn
}
