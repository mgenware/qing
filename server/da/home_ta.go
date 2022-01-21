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

// TableTypeHome ...
type TableTypeHome struct {
}

// Home ...
var Home = &TableTypeHome{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeHome) MingruSQLName() string {
	return "home"
}

// ------------ Actions ------------

// SelectDiscussions ...
func (mrTable *TableTypeHome) SelectDiscussions(queryable mingru.Queryable, page int, pageSize int) ([]UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 3 AS `thread_type`, `discussion`.`id`, `discussion`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `discussion`.`created_at`, `discussion`.`modified_at`, `discussion`.`title`, `discussion`.`reply_count` AS `value1`, 0 AS `value2`, 0 AS `value3` FROM `discussion` AS `discussion` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion`.`user_id` ORDER BY `discussion`.`created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item UserThreadInterface
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3)
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

// HomeTableSelectForumGroupsResult ...
type HomeTableSelectForumGroupsResult struct {
	DescHTML   string `json:"descHTML,omitempty"`
	ForumCount uint   `json:"forumCount,omitempty"`
	ID         uint64 `json:"-"`
	Name       string `json:"name,omitempty"`
	OrderIndex uint   `json:"orderIndex,omitempty"`
}

// SelectForumGroups ...
func (mrTable *TableTypeHome) SelectForumGroups(queryable mingru.Queryable) ([]HomeTableSelectForumGroupsResult, error) {
	rows, err := queryable.Query("SELECT `id`, `name`, `order_index`, `forum_count`, `desc` FROM `forum_group` ORDER BY `order_index` DESC")
	if err != nil {
		return nil, err
	}
	var result []HomeTableSelectForumGroupsResult
	defer rows.Close()
	for rows.Next() {
		var item HomeTableSelectForumGroupsResult
		err = rows.Scan(&item.ID, &item.Name, &item.OrderIndex, &item.ForumCount, &item.DescHTML)
		if err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return result, nil
}

// HomeTableSelectForumsResult ...
type HomeTableSelectForumsResult struct {
	GroupID     *uint64 `json:"groupID,omitempty"`
	ID          uint64  `json:"-"`
	Name        string  `json:"name,omitempty"`
	OrderIndex  uint    `json:"orderIndex,omitempty"`
	ThreadCount uint    `json:"threadCount,omitempty"`
}

// SelectForums ...
func (mrTable *TableTypeHome) SelectForums(queryable mingru.Queryable) ([]HomeTableSelectForumsResult, error) {
	rows, err := queryable.Query("SELECT `id`, `name`, `order_index`, `thread_count`, `group_id` FROM `forum`")
	if err != nil {
		return nil, err
	}
	var result []HomeTableSelectForumsResult
	defer rows.Close()
	for rows.Next() {
		var item HomeTableSelectForumsResult
		err = rows.Scan(&item.ID, &item.Name, &item.OrderIndex, &item.ThreadCount, &item.GroupID)
		if err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return result, nil
}

// SelectItems ...
func (mrTable *TableTypeHome) SelectItems(queryable mingru.Queryable, page int, pageSize int) ([]UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("(SELECT 1 AS `thread_type`, `post`.`id`, `post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `post`.`created_at`, `post`.`modified_at`, `post`.`title`, `post`.`likes` AS `value1`, `post`.`cmt_count` AS `value2`, 0 AS `value3` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` LIMIT ? OFFSET ?) UNION (SELECT 2 AS `thread_type`, `question`.`id`, `question`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `question`.`created_at`, `question`.`modified_at`, `question`.`title`, `question`.`likes` AS `value1`, `question`.`reply_count` AS `value2`, 0 AS `value3` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` LIMIT ? OFFSET ?) UNION (SELECT 3 AS `thread_type`, `discussion`.`id`, `discussion`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `discussion`.`created_at`, `discussion`.`modified_at`, `discussion`.`title`, `discussion`.`reply_count` AS `value1`, 0 AS `value2`, 0 AS `value3` FROM `discussion` AS `discussion` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion`.`user_id` LIMIT ? OFFSET ?) ORDER BY `created_at` DESC LIMIT ? OFFSET ?", limit, offset, limit, offset, limit, offset, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item UserThreadInterface
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3)
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

// SelectPosts ...
func (mrTable *TableTypeHome) SelectPosts(queryable mingru.Queryable, page int, pageSize int) ([]UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 1 AS `thread_type`, `post`.`id`, `post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `post`.`created_at`, `post`.`modified_at`, `post`.`title`, `post`.`likes` AS `value1`, `post`.`cmt_count` AS `value2`, 0 AS `value3` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` ORDER BY `post`.`created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item UserThreadInterface
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3)
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

// SelectQuestions ...
func (mrTable *TableTypeHome) SelectQuestions(queryable mingru.Queryable, page int, pageSize int) ([]UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 2 AS `thread_type`, `question`.`id`, `question`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `question`.`created_at`, `question`.`modified_at`, `question`.`title`, `question`.`likes` AS `value1`, `question`.`reply_count` AS `value2`, 0 AS `value3` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` ORDER BY `question`.`created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item UserThreadInterface
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3)
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
