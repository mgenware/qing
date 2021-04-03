/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package app

type CoreMemoryStoreConn interface {
	Destroy()
	SetStringValue(key string, val string, expiresInSecs int) error
	Exist(key string) (bool, error)
	GetStringValue(key string) (string, error)
	GetStringValueOrDefault(key string) (string, error)
	RemoveValue(key string) error
	Clear() error
	Ping() error
	Select(index int) error
}

type CoreMemoryStore interface {
	GetConn() CoreMemoryStoreConn
}
