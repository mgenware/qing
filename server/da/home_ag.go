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
	"time"

	"github.com/mgenware/mingru-go-lib"
)

type HomeAGType struct {
}

var Home = &HomeAGType{}

// ------------ Actions ------------

type HomeAGSelectPostsResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
	UserIconName  string    `json:"-"`
	UserID        uint64    `json:"-"`
	UserName      string    `json:"-"`
}

func (mrTable *HomeAGType) SelectPosts(mrQueryable mingru.Queryable, page int, pageSize int) ([]HomeAGSelectPostsResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `post`.`id`, `post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `post`.`created_at`, `post`.`modified_at`, `post`.`title`, `post`.`likes`, `post`.`cmt_count` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` ORDER BY `post`.`created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]HomeAGSelectPostsResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item HomeAGSelectPostsResult
			err = rows.Scan(&item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Likes, &item.CmtCount)
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

type HomeAGSelectPostsBRResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
	UserIconName  string    `json:"-"`
	UserID        uint64    `json:"-"`
	UserName      string    `json:"-"`
}

func (mrTable *HomeAGType) SelectPostsBR(mrQueryable mingru.Queryable, page int, pageSize int) ([]HomeAGSelectPostsBRResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `post`.`id`, `post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `post`.`created_at`, `post`.`modified_at`, `post`.`title`, `post`.`likes`, `post`.`cmt_count` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` WHERE `post`.`title` LIKE '%BR_' ORDER BY `post`.`created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]HomeAGSelectPostsBRResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item HomeAGSelectPostsBRResult
			err = rows.Scan(&item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Likes, &item.CmtCount)
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
