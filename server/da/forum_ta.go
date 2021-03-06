/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
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

// TableTypeForum ...
type TableTypeForum struct {
}

// Forum ...
var Forum = &TableTypeForum{}

// ------------ Actions ------------

// DeleteItem ...
func (da *TableTypeForum) DeleteItem(queryable mingru.Queryable, id uint64) error {
	result, err := queryable.Exec("DELETE FROM `forum` WHERE `id` = ?", id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertItem ...
func (da *TableTypeForum) InsertItem(queryable mingru.Queryable, name string, desc string, orderIndex uint, createdAt time.Time, groupID *uint64, threadCount uint, status uint8) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `forum` (`name`, `desc`, `order_index`, `created_at`, `group_id`, `thread_count`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?)", name, desc, orderIndex, createdAt, groupID, threadCount, status)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

// SelectDiscussions ...
func (da *TableTypeForum) SelectDiscussions(queryable mingru.Queryable, page int, pageSize int) ([]UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 3 AS `threadType`, `discussion`.`id` AS `id`, `discussion`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `discussion`.`created_at` AS `created_at`, `discussion`.`modified_at` AS `modified_at`, `discussion`.`title` AS `title`, `discussion`.`reply_count` AS `value1`, 0 AS `value2`, 0 AS `value3`, `discussion`.`last_replied_at` AS `last_replied_at` FROM `discussion` AS `discussion` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion`.`user_id` ORDER BY `last_replied_at` LIMIT ? OFFSET ?", limit, offset)
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
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3, &item.LastRepliedAt)
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

// ForumTableSelectForumResult ...
type ForumTableSelectForumResult struct {
	DescHTML     string    `json:"descHTML,omitempty"`
	ID           uint64    `json:"ID,omitempty"`
	Name         string    `json:"name,omitempty"`
	RawCreatedAt time.Time `json:"-"`
	ThreadCount  uint      `json:"threadCount,omitempty"`
}

// SelectForum ...
func (da *TableTypeForum) SelectForum(queryable mingru.Queryable, id uint64) (ForumTableSelectForumResult, error) {
	var result ForumTableSelectForumResult
	err := queryable.QueryRow("SELECT `id`, `name`, `desc`, `created_at`, `thread_count` FROM `forum` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.DescHTML, &result.RawCreatedAt, &result.ThreadCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

// SelectForumIDsForGroup ...
func (da *TableTypeForum) SelectForumIDsForGroup(queryable mingru.Queryable, groupID uint64) ([]uint64, error) {
	rows, err := queryable.Query("SELECT `id` FROM `forum` WHERE `group_id` = ?", groupID)
	if err != nil {
		return nil, err
	}
	var result []uint64
	defer rows.Close()
	for rows.Next() {
		var item uint64
		err = rows.Scan(&item)
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

// SelectGroupID ...
func (da *TableTypeForum) SelectGroupID(queryable mingru.Queryable, id uint64) (*uint64, error) {
	var result *uint64
	err := queryable.QueryRow("SELECT `group_id` FROM `forum` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// ForumTableSelectInfoForEditingResult ...
type ForumTableSelectInfoForEditingResult struct {
	DescHTML string `json:"descHTML,omitempty"`
	Name     string `json:"name,omitempty"`
}

// SelectInfoForEditing ...
func (da *TableTypeForum) SelectInfoForEditing(queryable mingru.Queryable, id uint64) (ForumTableSelectInfoForEditingResult, error) {
	var result ForumTableSelectInfoForEditingResult
	err := queryable.QueryRow("SELECT `name`, `desc` FROM `forum` WHERE `id` = ?", id).Scan(&result.Name, &result.DescHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// SelectQuestions ...
func (da *TableTypeForum) SelectQuestions(queryable mingru.Queryable, page int, pageSize int) ([]UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 2 AS `threadType`, `question`.`id` AS `id`, `question`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `question`.`created_at` AS `created_at`, `question`.`modified_at` AS `modified_at`, `question`.`title` AS `title`, `question`.`reply_count` AS `value1`, `question`.`up_votes` AS `value2`, `question`.`down_votes` AS `value3`, `question`.`last_replied_at` AS `last_replied_at` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` ORDER BY `last_replied_at` LIMIT ? OFFSET ?", limit, offset)
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
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3, &item.LastRepliedAt)
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

// SelectThreads ...
func (da *TableTypeForum) SelectThreads(queryable mingru.Queryable, page int, pageSize int) ([]UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("(SELECT 3 AS `threadType`, `discussion`.`id` AS `id`, `discussion`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `discussion`.`created_at` AS `created_at`, `discussion`.`modified_at` AS `modified_at`, `discussion`.`title` AS `title`, `discussion`.`reply_count` AS `value1`, 0 AS `value2`, 0 AS `value3`, `discussion`.`last_replied_at` AS `last_replied_at` FROM `discussion` AS `discussion` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion`.`user_id` LIMIT ? OFFSET ?) UNION (SELECT 2 AS `threadType`, `question`.`id` AS `id`, `question`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `question`.`created_at` AS `created_at`, `question`.`modified_at` AS `modified_at`, `question`.`title` AS `title`, `question`.`reply_count` AS `value1`, `question`.`up_votes` AS `value2`, `question`.`down_votes` AS `value3`, `question`.`last_replied_at` AS `last_replied_at` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` LIMIT ? OFFSET ?) ORDER BY `last_replied_at` DESC LIMIT ? OFFSET ?", limit, offset, limit, offset, limit, offset)
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
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3, &item.LastRepliedAt)
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

// UpdateInfo ...
func (da *TableTypeForum) UpdateInfo(queryable mingru.Queryable, id uint64, name string, desc string) error {
	result, err := queryable.Exec("UPDATE `forum` SET `name` = ?, `desc` = ? WHERE `id` = ?", name, desc, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
