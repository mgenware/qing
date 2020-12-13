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

// ------------ Actions ------------

// SelectDiscussions ...
func (da *TableTypeHome) SelectDiscussions(queryable mingru.Queryable, page int, pageSize int) ([]*UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 3 AS `threadType`, `discussion`.`id` AS `id`, `discussion`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `discussion`.`created_at` AS `created_at`, `discussion`.`modified_at` AS `modified_at`, `discussion`.`title` AS `title`, `discussion`.`reply_count` AS `value1` FROM `discussion` AS `discussion` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion`.`user_id` ORDER BY `created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &UserThreadInterface{}
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.CreatedAt, &item.ModifiedAt, &item.Title, &item.Value1)
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
func (da *TableTypeHome) SelectForumGroups(queryable mingru.Queryable) ([]*HomeTableSelectForumGroupsResult, error) {
	rows, err := queryable.Query("SELECT `id`, `name`, `order_index`, `forum_count`, `desc` FROM `forum_group` ORDER BY `order_index` DESC")
	if err != nil {
		return nil, err
	}
	result := make([]*HomeTableSelectForumGroupsResult, 0)
	defer rows.Close()
	for rows.Next() {
		item := &HomeTableSelectForumGroupsResult{}
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
func (da *TableTypeHome) SelectForums(queryable mingru.Queryable) ([]*HomeTableSelectForumsResult, error) {
	rows, err := queryable.Query("SELECT `id`, `name`, `order_index`, `thread_count`, `group_id` FROM `forum`")
	if err != nil {
		return nil, err
	}
	result := make([]*HomeTableSelectForumsResult, 0)
	defer rows.Close()
	for rows.Next() {
		item := &HomeTableSelectForumsResult{}
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
func (da *TableTypeHome) SelectItems(queryable mingru.Queryable, page int, pageSize int) ([]*UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("(SELECT 1 AS `threadType`, `post`.`id` AS `id`, `post`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `post`.`created_at` AS `created_at`, `post`.`modified_at` AS `modified_at`, `post`.`title` AS `title`, `post`.`likes` AS `value1`, `post`.`cmt_count` AS `value2` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` LIMIT ? OFFSET ?) UNION (SELECT 2 AS `threadType`, `question`.`id` AS `id`, `question`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `question`.`created_at` AS `created_at`, `question`.`modified_at` AS `modified_at`, `question`.`title` AS `title`, `question`.`reply_count` AS `value1`, `question`.`up_votes` AS `value2`, `question`.`down_votes` AS `value3` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` LIMIT ? OFFSET ?) UNION (SELECT 3 AS `threadType`, `discussion`.`id` AS `id`, `discussion`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `discussion`.`created_at` AS `created_at`, `discussion`.`modified_at` AS `modified_at`, `discussion`.`title` AS `title`, `discussion`.`reply_count` AS `value1` FROM `discussion` AS `discussion` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion`.`user_id` LIMIT ? OFFSET ?) ORDER BY `created_at` DESC LIMIT ? OFFSET ?", limit, offset, limit, offset, limit, offset, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &UserThreadInterface{}
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.CreatedAt, &item.ModifiedAt, &item.Title, &item.Value1, &item.Value2)
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
func (da *TableTypeHome) SelectPosts(queryable mingru.Queryable, page int, pageSize int) ([]*UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 1 AS `threadType`, `post`.`id` AS `id`, `post`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `post`.`created_at` AS `created_at`, `post`.`modified_at` AS `modified_at`, `post`.`title` AS `title`, `post`.`likes` AS `value1`, `post`.`cmt_count` AS `value2` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` ORDER BY `created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &UserThreadInterface{}
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.CreatedAt, &item.ModifiedAt, &item.Title, &item.Value1, &item.Value2)
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
func (da *TableTypeHome) SelectQuestions(queryable mingru.Queryable, page int, pageSize int) ([]*UserThreadInterface, bool, error) {
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
	rows, err := queryable.Query("SELECT 2 AS `threadType`, `question`.`id` AS `id`, `question`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `question`.`created_at` AS `created_at`, `question`.`modified_at` AS `modified_at`, `question`.`title` AS `title`, `question`.`reply_count` AS `value1`, `question`.`up_votes` AS `value2`, `question`.`down_votes` AS `value3` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` ORDER BY `created_at` LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*UserThreadInterface, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &UserThreadInterface{}
			err = rows.Scan(&item.ThreadType, &item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.CreatedAt, &item.ModifiedAt, &item.Title, &item.Value1, &item.Value2, &item.Value3)
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
