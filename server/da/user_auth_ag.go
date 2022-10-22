/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import "github.com/mgenware/mingru-go-lib"

type UserAuthAGType struct {
}

var UserAuth = &UserAuthAGType{}

// ------------ Actions ------------

func (mrTable *UserAuthAGType) AddUserAuth(mrQueryable mingru.Queryable, id uint64, authType uint16) error {
	_, err := mrQueryable.Exec("INSERT INTO `user_auth` (`id`, `auth_type`) VALUES (?, ?)", id, authType)
	return err
}

func (mrTable *UserAuthAGType) TestDelete(mrQueryable mingru.Queryable, id uint64) (int, error) {
	result, err := mrQueryable.Exec("DELETE FROM `user_auth` WHERE `id` = ?", id)
	return mingru.GetRowsAffectedIntWithError(result, err)
}
