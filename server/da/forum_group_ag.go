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
	"time"

	"github.com/mgenware/mingru-go-lib"
)

type ForumGroupAGType struct {
}

var ForumGroupAG = &ForumGroupAGType{}

// ------------ Actions ------------

func (mrTable *ForumGroupAGType) DeleteGroup(mrQueryable mingru.Queryable, id uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `forum_group` WHERE `id` = ?", id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *ForumGroupAGType) InsertGroup(mrQueryable mingru.Queryable, name string, descHTML string) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `forum_group` (`name`, `desc`, `order_index`, `created_at`, `forum_count`) VALUES (?, ?, 0, UTC_TIMESTAMP(), 0)", name, descHTML)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

type ForumGroupTableSelectGroupResult struct {
	DescHTML     string    `json:"descHTML,omitempty"`
	ForumCount   uint      `json:"forumCount,omitempty"`
	ID           uint64    `json:"id,omitempty"`
	Name         string    `json:"name,omitempty"`
	RawCreatedAt time.Time `json:"-"`
}

func (mrTable *ForumGroupAGType) SelectGroup(mrQueryable mingru.Queryable, id uint64) (ForumGroupTableSelectGroupResult, error) {
	var result ForumGroupTableSelectGroupResult
	err := mrQueryable.QueryRow("SELECT `id`, `name`, `desc`, `created_at`, `forum_count` FROM `forum_group` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.DescHTML, &result.RawCreatedAt, &result.ForumCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

type ForumGroupTableSelectInfoForEditingResult struct {
	DescHTML string `json:"descHTML,omitempty"`
	Name     string `json:"name,omitempty"`
}

func (mrTable *ForumGroupAGType) SelectInfoForEditing(mrQueryable mingru.Queryable, id uint64) (ForumGroupTableSelectInfoForEditingResult, error) {
	var result ForumGroupTableSelectInfoForEditingResult
	err := mrQueryable.QueryRow("SELECT `name`, `desc` FROM `forum_group` WHERE `id` = ?", id).Scan(&result.Name, &result.DescHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *ForumGroupAGType) UpdateInfo(mrQueryable mingru.Queryable, id uint64, name string, descHTML string) error {
	result, err := mrQueryable.Exec("UPDATE `forum_group` SET `name` = ?, `desc` = ? WHERE `id` = ?", name, descHTML, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
