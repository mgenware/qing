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

type TableTypeHome struct {
}

var Home = &TableTypeHome{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeHome) MingruSQLName() string {
	return "home"
}

// ------------ Actions ------------

type HomeTableSelectForumGroupsResult struct {
	DescHTML   string `json:"descHTML,omitempty"`
	ForumCount uint   `json:"forumCount,omitempty"`
	ID         uint64 `json:"-"`
	Name       string `json:"name,omitempty"`
	OrderIndex uint   `json:"orderIndex,omitempty"`
}

func (mrTable *TableTypeHome) SelectForumGroups(mrQueryable mingru.Queryable) ([]HomeTableSelectForumGroupsResult, error) {
	rows, err := mrQueryable.Query("SELECT `id`, `name`, `order_index`, `forum_count`, `desc` FROM `forum_group` ORDER BY `order_index` DESC")
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

type HomeTableSelectForumsResult struct {
	GroupID     *uint64 `json:"groupID,omitempty"`
	ID          uint64  `json:"-"`
	Name        string  `json:"name,omitempty"`
	OrderIndex  uint    `json:"orderIndex,omitempty"`
	ThreadCount uint    `json:"threadCount,omitempty"`
}

func (mrTable *TableTypeHome) SelectForums(mrQueryable mingru.Queryable) ([]HomeTableSelectForumsResult, error) {
	rows, err := mrQueryable.Query("SELECT `id`, `name`, `order_index`, `thread_count`, `group_id` FROM `forum`")
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
