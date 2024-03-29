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

import (
	"fmt"

	"github.com/mgenware/mingru-go-lib"
)

type ForumModAGType struct {
}

var ForumMod = &ForumModAGType{}

// ------------ Actions ------------

func (mrTable *ForumModAGType) DeleteMod(mrQueryable mingru.Queryable, objectID uint64, userID uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `forum_mod` WHERE (`object_id` = ? AND `user_id` = ?)", objectID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *ForumModAGType) DeleteUserFromForumMods(mrQueryable mingru.Queryable, userID uint64, forumIDs []uint64) (int, error) {
	if len(forumIDs) == 0 {
		return 0, fmt.Errorf("the array argument `forumIDs` cannot be empty")
	}
	var queryParams []any
	queryParams = append(queryParams, userID)
	for _, item := range forumIDs {
		queryParams = append(queryParams, item)
	}
	result, err := mrQueryable.Exec("DELETE FROM `forum_mod` WHERE (`user_id` = ? AND `object_id` IN "+mingru.InputPlaceholders(len(forumIDs))+")", queryParams...)
	return mingru.GetRowsAffectedIntWithError(result, err)
}

func (mrTable *ForumModAGType) InsertMod(mrQueryable mingru.Queryable, objectID uint64, userID uint64) error {
	_, err := mrQueryable.Exec("INSERT INTO `forum_mod` (`object_id`, `user_id`) VALUES (?, ?)", objectID, userID)
	return err
}

func (mrTable *ForumModAGType) SelectIsMod(mrQueryable mingru.Queryable, objectID uint64, userID uint64) (bool, error) {
	var result bool
	err := mrQueryable.QueryRow("SELECT EXISTS(SELECT * FROM `forum_mod` WHERE (`object_id` = ? AND `user_id` = ?))", objectID, userID).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}
