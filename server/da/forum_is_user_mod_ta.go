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

type TableTypeForumIsUserMod struct {
}

var ForumIsUserMod = &TableTypeForumIsUserMod{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeForumIsUserMod) MingruSQLName() string {
	return "forum_is_user_mod"
}

// ------------ Actions ------------

func (mrTable *TableTypeForumIsUserMod) Has(mrQueryable mingru.Queryable, id uint64) (bool, error) {
	var result bool
	err := mrQueryable.QueryRow("SELECT EXISTS(SELECT * FROM `forum_is_user_mod` WHERE `id` = ?)", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}
