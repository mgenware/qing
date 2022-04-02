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

type TableTypeComHome struct {
}

var ComHome = &TableTypeComHome{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeComHome) MingruSQLName() string {
	return "com_home"
}

// ------------ Actions ------------

func (mrTable *TableTypeComHome) SelectThreads(mrQueryable mingru.Queryable, page int, pageSize int) ([]ThreadFeedInterface, bool, error) {
	if page <= 0 {
		err := fmt.Errorf("Invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("Invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := mrQueryable.Query("SELECT `thread`.`id`, `thread`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `thread`.`created_at`, `thread`.`modified_at`, `thread`.`title`, `thread`.`likes`, `thread`.`msg_count`, `thread`.`last_replied_at` FROM `thread` AS `thread` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `thread`.`user_id` ORDER BY `thread`.`created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]ThreadFeedInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item ThreadFeedInterface
			err = rows.Scan(&item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Likes, &item.MsgCount, &item.LastRepliedAt)
			if err != nil {
				return nil, false, err
			}
			result = append(result, item)
		}
	}
	err = rows.Err()
	if err != nil {
		return nil, false, err
	}
	return result, itemCounter > len(result), nil
}
