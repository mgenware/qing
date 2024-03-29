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

type ForumHomeAGType struct {
}

var ForumHome = &ForumHomeAGType{}

// ------------ Actions ------------

type ForumHomeAGSelectForumGroupsResult struct {
	DescHTML   string `json:"descHTML,omitempty"`
	ForumCount uint   `json:"forumCount,omitempty"`
	ID         uint64 `json:"-"`
	Name       string `json:"name,omitempty"`
	OrderIndex uint   `json:"orderIndex,omitempty"`
}

func (mrTable *ForumHomeAGType) SelectForumGroups(mrQueryable mingru.Queryable) ([]ForumHomeAGSelectForumGroupsResult, error) {
	rows, err := mrQueryable.Query("SELECT `id`, `name`, `order_index`, `forum_count`, `desc` FROM `forum_group` ORDER BY `order_index` DESC")
	if err != nil {
		return nil, err
	}
	var result []ForumHomeAGSelectForumGroupsResult
	defer rows.Close()
	for rows.Next() {
		var item ForumHomeAGSelectForumGroupsResult
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

type ForumHomeAGSelectForumsResult struct {
	FPostCount uint    `json:"fPostCount,omitempty"`
	GroupID    *uint64 `json:"groupID,omitempty"`
	ID         uint64  `json:"-"`
	Name       string  `json:"name,omitempty"`
	OrderIndex uint    `json:"orderIndex,omitempty"`
}

func (mrTable *ForumHomeAGType) SelectForums(mrQueryable mingru.Queryable) ([]ForumHomeAGSelectForumsResult, error) {
	rows, err := mrQueryable.Query("SELECT `id`, `name`, `order_index`, `fpost_count`, `group_id` FROM `forum`")
	if err != nil {
		return nil, err
	}
	var result []ForumHomeAGSelectForumsResult
	defer rows.Close()
	for rows.Next() {
		var item ForumHomeAGSelectForumsResult
		err = rows.Scan(&item.ID, &item.Name, &item.OrderIndex, &item.FPostCount, &item.GroupID)
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
