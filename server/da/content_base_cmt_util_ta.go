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

// TableTypeContentBaseCmtUtil ...
type TableTypeContentBaseCmtUtil struct {
}

// ContentBaseCmtUtil ...
var ContentBaseCmtUtil = &TableTypeContentBaseCmtUtil{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeContentBaseCmtUtil) MingruSQLName() string {
	return "content_base_cmt_util"
}

// ------------ Actions ------------

// SelectRootCmts ...
func (mrTable *TableTypeContentBaseCmtUtil) SelectRootCmts(mrQueryable mingru.Queryable, mrFromTable mingru.Table, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `content_base_cmt_util`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`reply_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name` FROM "+mrFromTable.MingruSQLName()+" AS `content_base_cmt_util` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `content_base_cmt_util`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `content_base_cmt_util`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]CmtData, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item CmtData
			err = rows.Scan(&item.ID, &item.ContentHTML, &item.RawCreatedAt, &item.RawModifiedAt, &item.ReplyCount, &item.Likes, &item.UserID, &item.UserName, &item.UserIconName)
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

// SelectRootCmtsWithLikes ...
func (mrTable *TableTypeContentBaseCmtUtil) SelectRootCmtsWithLikes(mrQueryable mingru.Queryable, mrFromTable mingru.Table, viewerUserID uint64, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `content_base_cmt_util`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`reply_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name`, `join_3`.`user_id` AS `has_liked` FROM "+mrFromTable.MingruSQLName()+" AS `content_base_cmt_util` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `content_base_cmt_util`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` LEFT JOIN `cmt_like` AS `join_3` ON `join_3`.`host_id` = `content_base_cmt_util`.`cmt_id` AND `join_3`.`user_id` = ? WHERE `content_base_cmt_util`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", viewerUserID, hostID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]CmtData, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item CmtData
			err = rows.Scan(&item.ID, &item.ContentHTML, &item.RawCreatedAt, &item.RawModifiedAt, &item.ReplyCount, &item.Likes, &item.UserID, &item.UserName, &item.UserIconName, &item.HasLiked)
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
