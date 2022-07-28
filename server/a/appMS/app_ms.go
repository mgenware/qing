/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appMS

import (
	"context"
	"errors"
	"fmt"
	"qing/a/app"
	"time"

	"github.com/go-redis/redis/v8"
)

var ctx = context.TODO()

type AppMS struct {
	Port int
}

func (store *AppMS) GetConn() app.CoreMemoryStoreConn {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("ms:%v", store.Port),
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	return newAppMSConn(rdb)
}

func newAppMS(port int) *AppMS {
	return &AppMS{Port: port}
}

type AppMSConn struct {
	rdb *redis.Client
}

func newAppMSConn(rdb *redis.Client) *AppMSConn {
	return &AppMSConn{rdb: rdb}
}

func (conn *AppMSConn) Conn() *redis.Client {
	return conn.rdb
}

func (conn *AppMSConn) Destroy() error {
	return conn.rdb.Close()
}

func (conn *AppMSConn) SetStringValue(key string, val string, expires time.Duration) error {
	return conn.setValueWithTimeoutInternal(key, val, expires)
}

func (conn *AppMSConn) Exist(key string) (bool, error) {
	val, err := conn.rdb.Exists(ctx, key).Result()
	if err == redis.Nil {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return val > 0, nil
}

func (conn *AppMSConn) GetStringValue(key string) (string, error) {
	val, err := conn.rdb.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", nil
	}
	return val, err
}

func (conn *AppMSConn) RemoveValue(key string) error {
	_, err := conn.rdb.Del(ctx, key).Result()
	return err
}

func (conn *AppMSConn) Ping() error {
	val, err := conn.rdb.Ping(ctx).Result()
	if err != nil {
		return err
	}
	if val != "PONG" {
		return errors.New("Redis responded with " + val)
	}
	return nil
}

/*** Internal functions ***/

func (conn *AppMSConn) setValueInternal(key string, val any) error {
	return conn.setValueWithTimeoutInternal(key, val, 0)
}

func (conn *AppMSConn) setValueWithTimeoutInternal(key string, val any, expires time.Duration) error {
	_, err := conn.rdb.Set(ctx, key, val, expires).Result()
	return err
}
