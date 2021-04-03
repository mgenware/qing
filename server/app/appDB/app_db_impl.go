/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appDB

import (
	"database/sql"
	"qing/app/config"

	// Load MySQL driver
	_ "github.com/go-sql-driver/mysql"
)

type AppDBImpl struct {
	db *sql.DB
}

func (impl *AppDBImpl) DB() *sql.DB {
	return impl.db
}

func newAppDBImpl(conf *config.Config) *AppDBImpl {
	dbConf := conf.DB
	if dbConf.ConnString == "" {
		panic("Empty DBConnString in config")
	}
	conn, err := sql.Open("mysql", dbConf.ConnString)
	if err != nil {
		panic(err)
	}

	res := &AppDBImpl{
		db: conn,
	}
	return res
}
