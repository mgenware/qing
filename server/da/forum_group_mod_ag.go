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

type TableTypeForumGroupMod struct {
}

var ForumGroupMod = &TableTypeForumGroupMod{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeForumGroupMod) MingruSQLName() string {
	return "forum_group_mod"
}

// ------------ Actions ------------

func (mrTable *TableTypeForumGroupMod) DeleteMod(mrQueryable mingru.Queryable, objectID uint64, userID uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `forum_group_mod` WHERE (`object_id` = ? AND `user_id` = ?)", objectID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeForumGroupMod) InsertMod(mrQueryable mingru.Queryable, objectID uint64, userID uint64) error {
	_, err := mrQueryable.Exec("INSERT INTO `forum_group_mod` (`object_id`, `user_id`) VALUES (?, ?)", objectID, userID)
	return err
}

func (mrTable *TableTypeForumGroupMod) SelectIsMod(mrQueryable mingru.Queryable, objectID uint64, userID uint64) (bool, error) {
	var result bool
	err := mrQueryable.QueryRow("SELECT EXISTS(SELECT * FROM `forum_group_mod` WHERE (`object_id` = ? AND `user_id` = ?))", objectID, userID).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}