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
	"qing/app"

	"github.com/gomodule/redigo/redis"
)

type AppMS struct {
	Port int
}

func (store *AppMS) GetConn() app.CoreMemoryStoreConn {
	pool := &redis.Pool{
		MaxIdle:   80,
		MaxActive: 12000, // max number of connections
		Dial: func() (redis.Conn, error) {
			return redis.Dial("tcp", fmt.Sprintf("ms:%v", store.Port))
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

func (conn *AppMSConn) Pool() *redis.Pool {
	return conn.pool
}

func (conn *AppMSConn) Destroy() error {
	return conn.pool.Close()
}

func (conn *AppMSConn) SetStringValue(key string, val string, expiresInSecs int) error {
	if expiresInSecs > 0 {
		return conn.setValueWithTimeoutInternal(key, val, expiresInSecs)
	}
	return conn.setValueInternal(key, val)
}

func (conn *AppMSConn) Exist(key string) (bool, error) {
	c := conn.pool.Get()
	defer c.Close()

	exists, err := redis.Bool(c.Do("EXISTS", key))
	if err == conn.nilValueErr() {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (conn *AppMSConn) GetStringValue(key string) (string, error) {
	c := conn.pool.Get()
	defer c.Close()

	value, err := redis.String(c.Do("GET", key))
	if err == conn.nilValueErr() {
		return "", nil
	}
	return value, err
}

func (conn *AppMSConn) RemoveValue(key string) error {
	c := conn.pool.Get()
	defer c.Close()

	_, err := c.Do("DEL", key)
	return err
}

func (conn *AppMSConn) Clear() error {
	c := conn.pool.Get()
	defer c.Close()

	_, err := c.Do("FLUSHALL")
	return err
}

func (conn *AppMSConn) Ping() error {
	c := conn.pool.Get()
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

/*** Internal functions ***/

func (conn *AppMSConn) setValueInternal(key string, val interface{}) error {
	c := conn.pool.Get()
	defer c.Close()

	_, err := c.Do("SET", key, val)
	return err
}

func (conn *AppMSConn) setValueWithTimeoutInternal(key string, val interface{}, expires int) error {
	c := conn.pool.Get()
	defer c.Close()

	_, err := c.Do("SETEX", key, expires, val)
	return err
}

func (conn *AppMSConn) nilValueErr() error {
	return redis.ErrNil
}
