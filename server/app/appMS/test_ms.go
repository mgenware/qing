/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appMS

import (
	"errors"
	"qing/app"
	"time"
)

var nilValErr error

func init() {
	nilValErr = errors.New("nil value")
}

type TestMS struct {
	d map[string]string
}

func (store *TestMS) GetConn() app.CoreMemoryStoreConn {
	return store
}

func (store *TestMS) Destroy() error {
	return nil
}

func (store *TestMS) SetStringValue(key string, val string, expiresInSecs int) error {
	store.d[key] = val
	time.AfterFunc(time.Duration(expiresInSecs)*time.Second, func() { delete(store.d, key) })
	return nil
}

func (store *TestMS) Exist(key string) (bool, error) {
	val := store.d[key]
	if val == "" {
		return false, nil
	}
	return true, nil
}

func (store *TestMS) GetStringValue(key string) (string, error) {
	return store.d[key], nil
}

func (store *TestMS) RemoveValue(key string) error {
	delete(store.d, key)
	return nil
}

func (store *TestMS) Clear() error {
	store.d = make(map[string]string)
	return nil
}

func (store *TestMS) Ping() error {
	return nil
}
