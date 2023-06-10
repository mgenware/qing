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

type ComHomeAGType struct {
}

var ComHome = &ComHomeAGType{}

// ------------ Actions ------------

func (mrTable *ComHomeAGType) SelectThreads(mrQueryable mingru.Queryable, page int, pageSize int) ([]DBThreadFeed, bool, error) {
	if page <= 0 {
		err := fmt.Errorf("invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := mrQueryable.Query("SELECT `f_post`.`id`, `f_post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `f_post`.`created_at`, `f_post`.`modified_at`, `f_post`.`title`, `f_post`.`likes`, `f_post`.`cmt_count`, `f_post`.`last_replied_at` FROM `f_post` AS `f_post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `f_post`.`user_id` ORDER BY `f_post`.`created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]DBThreadFeed, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item DBThreadFeed
			err = rows.Scan(&item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Likes, &item.CmtCount, &item.LastRepliedAt)
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
