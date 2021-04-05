/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package app

import "database/sql"

type CoreDB interface {
	// DB returns a `*sql.DB`.
	DB() *sql.DB

	// Mock returns a mock for testing.
	Mock() interface{}
}
