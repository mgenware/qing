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

var ForumGroup = &ForumGroupAGType{}

// ------------ Actions ------------

func (mrTable *ForumGroupAGType) DeleteGroup(mrQueryable mingru.Queryable, id uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `forum_group` WHERE `id` = ?", id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *ForumGroupAGType) InsertGroup(mrQueryable mingru.Queryable, name string, descHTML string, descSrc *string) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `forum_group` (`order_index`, `created_at`, `forum_count`, `name`, `desc`, `desc_src`) VALUES (0, NOW(3), 0, ?, ?, ?)", name, descHTML, descSrc)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

type ForumGroupAGSelectGroupResult struct {
	DescHTML     string    `json:"descHTML,omitempty"`
	ForumCount   uint      `json:"forumCount,omitempty"`
	ID           uint64    `json:"id,omitempty"`
	Name         string    `json:"name,omitempty"`
	RawCreatedAt time.Time `json:"-"`
}

func (mrTable *ForumGroupAGType) SelectGroup(mrQueryable mingru.Queryable, id uint64) (ForumGroupAGSelectGroupResult, error) {
	var result ForumGroupAGSelectGroupResult
	err := mrQueryable.QueryRow("SELECT `id`, `name`, `desc`, `created_at`, `forum_count` FROM `forum_group` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.DescHTML, &result.RawCreatedAt, &result.ForumCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

type ForumGroupAGSelectInfoForEditingResult struct {
	DescHTML string `json:"descHTML,omitempty"`
	Name     string `json:"name,omitempty"`
}

func (mrTable *ForumGroupAGType) SelectInfoForEditing(mrQueryable mingru.Queryable, id uint64) (ForumGroupAGSelectInfoForEditingResult, error) {
	var result ForumGroupAGSelectInfoForEditingResult
	err := mrQueryable.QueryRow("SELECT `name`, `desc` FROM `forum_group` WHERE `id` = ?", id).Scan(&result.Name, &result.DescHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *ForumGroupAGType) UpdateInfo(mrQueryable mingru.Queryable, id uint64, name string, descHTML string, descSrc *string) error {
	result, err := mrQueryable.Exec("UPDATE `forum_group` SET `name` = ?, `desc` = ?, `desc_src` = ? WHERE `id` = ?", name, descHTML, descSrc, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
