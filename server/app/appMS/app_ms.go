/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appMS

import (
	"errors"
	"fmt"

	"github.com/gomodule/redigo/redis"
)

// ErrNil indicates an empty reply from server.
var ErrNil = redis.ErrNil

type AppMS struct {
	Port int
}

func (store *AppMS) GetConn() *AppMSConn {
	pool := &redis.Pool{
		MaxIdle:   80,
		MaxActive: 12000, // max number of connections
		Dial: func() (redis.Conn, error) {
			return redis.Dial("tcp", fmt.Sprintf(":%v", store.Port))
		},
	}

	return newAppMSConn(pool)
}

func newAppMS(port int) *AppMS {
	return &AppMS{Port: port}
}

type AppMSConn struct {
	pool *redis.Pool
}

func newAppMSConn(pool *redis.Pool) *AppMSConn {
	return &AppMSConn{pool: pool}
}

func (store *AppMSConn) Pool() *redis.Pool {
	return store.pool
}

func (store *AppMSConn) Destroy() error {
	return store.pool.Close()
}

func (store *AppMSConn) SetStringValue(key string, val string, expiresInSecs int) error {
	if expiresInSecs > 0 {
		return store.setValueWithTimeoutInternal(key, val, expiresInSecs)
	}
	return store.setValueInternal(key, val)
}

func (store *AppMSConn) Exist(key string) (bool, error) {
	c := store.pool.Get()
	defer c.Close()

	exists, err := redis.Bool(c.Do("EXISTS", key))
	if err == ErrNil {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (store *AppMSConn) GetStringValue(key string) (string, error) {
	c := store.pool.Get()
	defer c.Close()

	return redis.String(c.Do("GET", key))
}

func (store *AppMSConn) GetStringValueOrDefault(key string) (string, error) {
	value, err := store.GetStringValue(key)
	if err == ErrNil {
		return "", nil
	}
	return value, err
}

func (store *AppMSConn) RemoveValue(key string) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("DEL", key)
	return err
}

func (store *AppMSConn) Clear() error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("FLUSHALL")
	return err
}

func (store *AppMSConn) Ping() error {
	c := store.pool.Get()
	defer c.Close()

	res, err := redis.String(c.Do("PING"))
	if err != nil {
		return err
	}
	if res != "PONG" {
		return errors.New("Redis responded with " + res)
	}
	return nil
}

func (store *AppMSConn) Select(index int) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("SELECT", index)
	return err
}

/*** Internal functions ***/

func (store *AppMSConn) setValueInternal(key string, val interface{}) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("SET", key, val)
	return err
}

func (store *AppMSConn) setValueWithTimeoutInternal(key string, val interface{}, expires int) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("SETEX", key, expires, val)
	return err
}
