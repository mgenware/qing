/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

 /******************************************************************************************
  * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/

package da

import "github.com/mgenware/mingru-go-lib"

// TableTypeUserAuth ...
type TableTypeUserAuth struct {
}

// UserAuth ...
var UserAuth = &TableTypeUserAuth{}

// ------------ Actions ------------

// AddUserAuth ...
func (da *TableTypeUserAuth) AddUserAuth(queryable mingru.Queryable, id uint64, authType uint16) error {
	_, err := queryable.Exec("INSERT INTO `user_auth` (`id`, `auth_type`) VALUES (?, ?)", id, authType)
	return err
}
