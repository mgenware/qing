/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appDB

import (
	"database/sql"
	"qing/a/cfgx"
	"strconv"

	// Load MySQL driver
	_ "github.com/go-sql-driver/mysql"
)

type AppDB struct {
	db *sql.DB
}

func (impl *AppDB) DB() *sql.DB {
	return impl.db
}

func newAppDB(config *cfgx.CoreConfig) *AppDB {
	c := config.DB
	connStr := c.User + ":" + c.Pwd + "@tcp(" + c.Host + ":" + strconv.Itoa(c.Port) + ")/" + c.Database + c.Params
	conn, err := sql.Open("mysql", connStr)
	if err != nil {
		panic(err)
	}

	res := &AppDB{
		db: conn,
	}
	return res
}
