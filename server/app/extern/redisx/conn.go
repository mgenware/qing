package redisx

import (
	"errors"
	"fmt"

	"github.com/garyburd/redigo/redis"
)

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

func (store *Conn) SetStringValue(key string, val string, expires int) error {
	if expires > 0 {
		return store.setValueWithTimeoutInternal(key, val, expires)
	}
	return store.setValueInternal(key, val)
}

func (store *Conn) GetStringValue(key string) (string, error) {
	c := store.pool.Get()
	defer c.Close()

	return redis.String(c.Do("GET", key))
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
