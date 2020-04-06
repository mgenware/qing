package redisx

import (
	"errors"
	"fmt"

	"github.com/gomodule/redigo/redis"
)

// ErrNil indicates an empty reply from server.
var ErrNil = redis.ErrNil

type Conn struct {
	pool *redis.Pool
}

func NewConn(port int) *Conn {
	pool := &redis.Pool{
		MaxIdle:   80,
		MaxActive: 12000, // max number of connections
		Dial: func() (redis.Conn, error) {
			return redis.Dial("tcp", fmt.Sprintf(":%v", port))
		},
	}

	d := &Conn{}
	d.pool = pool
	return d
}

func (store *Conn) Pool() *redis.Pool {
	return store.pool
}

func (store *Conn) Destroy() error {
	return store.pool.Close()
}

func (store *Conn) SetStringValue(key string, val string, expiresInSecs int) error {
	if expiresInSecs > 0 {
		return store.setValueWithTimeoutInternal(key, val, expiresInSecs)
	}
	return store.setValueInternal(key, val)
}

func (store *Conn) GetStringValue(key string) (string, error) {
	c := store.pool.Get()
	defer c.Close()

	return redis.String(c.Do("GET", key))
}

func (store *Conn) GetStringValueOrDefault(key string) (string, error) {
	value, err := store.GetStringValue(key)
	if err == ErrNil {
		return "", nil
	}
	return value, err
}

func (store *Conn) RemoveValue(key string) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("DEL", key)
	return err
}

func (store *Conn) Clear() error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("FLUSHALL")
	return err
}

func (store *Conn) Ping() error {
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

func (store *Conn) Select(index int) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("SELECT", index)
	return err
}

/*** Internal functions ***/

func (store *Conn) setValueInternal(key string, val interface{}) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("SET", key, val)
	return err
}

func (store *Conn) setValueWithTimeoutInternal(key string, val interface{}, expires int) error {
	c := store.pool.Get()
	defer c.Close()

	_, err := c.Do("SETEX", key, expires, val)
	return err
}
