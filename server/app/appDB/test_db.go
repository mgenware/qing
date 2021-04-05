/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appDB

import (
	"database/sql"

	"github.com/DATA-DOG/go-sqlmock"
)

type TestDB struct {
	mock sqlmock.Sqlmock
	db   *sql.DB
}

func (impl *TestDB) DB() *sql.DB {
	if impl.db != nil {
		return impl.db
	}
	db, mock, err := sqlmock.New()
	if err != nil {
		panic(err)
	}
	impl.db = db
	impl.mock = mock
	return db
}

func (impl *TestDB) Mock() interface{} {
	return impl.mock
}

func newTestDB() *TestDB {
	return &TestDB{}
}
