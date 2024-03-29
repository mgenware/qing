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
	"qing/a/coretype"
	"time"

	"github.com/redis/go-redis/v9"
)

var ctx = context.TODO()

var ErrExpiryTooShort = errors.New("expiry too short")

type AppMS struct {
	logging bool

	Port int
}

func (store *AppMS) GetConn() coretype.CoreMemoryStoreConn {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("ms:%v", store.Port),
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	return newAppMSConn(rdb, store.logging)
}

func newAppMS(port int, logging bool) *AppMS {
	return &AppMS{Port: port, logging: logging}
}

type AppMSConn struct {
	logging bool

	rdb *redis.Client
}

func (conn *AppMSConn) RDB() *redis.Client {
	return conn.rdb
}

func newAppMSConn(rdb *redis.Client, logging bool) *AppMSConn {
	return &AppMSConn{rdb: rdb, logging: logging}
}

func (conn *AppMSConn) Conn() *redis.Client {
	return conn.rdb
}

func (conn *AppMSConn) Destroy() error {
	if conn.logging {
		conn.log("Destroy")
	}
	return conn.rdb.Close()
}

func (conn *AppMSConn) SetStringValue(key string, val string, expiry time.Duration) error {
	if expiry < 500*time.Millisecond {
		return ErrExpiryTooShort
	}
	_, err := conn.rdb.Set(ctx, key, val, expiry).Result()
	if conn.logging {
		conn.log(fmt.Sprintf("SetStringInternal: K: `%v` V: `%v` EXPIRE: %v ERR: %v", key, val, expiry, err))
	}
	return err
}

func (conn *AppMSConn) Exist(key string) (bool, error) {
	val, err := conn.rdb.Exists(ctx, key).Result()
	if conn.logging {
		conn.log(fmt.Sprintf("Exist: V: `%v` ERR: %v", val, err))
	}
	if err == redis.Nil {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return val > 0, nil
}

func (conn *AppMSConn) GetStringValue(key string) (bool, string, error) {
	val, err := conn.rdb.Get(ctx, key).Result()
	if conn.logging {
		conn.log(fmt.Sprintf("GetStringValue: K: `%v` V: `%v` ERR: %v", key, val, err))
	}
	if err == redis.Nil {
		return false, "", nil
	}
	return true, val, err
}

func (conn *AppMSConn) RemoveValue(key string) error {
	_, err := conn.rdb.Del(ctx, key).Result()
	if conn.logging {
		conn.log(fmt.Sprintf("RemoveValue: K: `%v` ERR: %v", key, err))
	}
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

func (conn *AppMSConn) log(s string) {
	// Temporarily muted.
	// log.Println("🐎 " + s)
}
