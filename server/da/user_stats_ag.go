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

type TableTypeUserStats struct {
}

var UserStats = &TableTypeUserStats{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeUserStats) MingruSQLName() string {
	return "user_stats"
}

// ------------ Actions ------------

type UserStatsTableSelectStatsResult struct {
	PostCount      uint `json:"postCount,omitempty"`
	ThreadCount    uint `json:"threadCount,omitempty"`
	ThreadMsgCount uint `json:"threadMsgCount,omitempty"`
}

func (mrTable *TableTypeUserStats) SelectStats(mrQueryable mingru.Queryable, id uint64) (UserStatsTableSelectStatsResult, error) {
	var result UserStatsTableSelectStatsResult
	err := mrQueryable.QueryRow("SELECT `post_count`, `thread_count`, `thread_msg_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result.PostCount, &result.ThreadCount, &result.ThreadMsgCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeUserStats) TestSelectAnswerCount(mrQueryable mingru.Queryable, id uint64) (uint, error) {
	var result uint
	err := mrQueryable.QueryRow("SELECT `thread_msg_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeUserStats) TestSelectPostCount(mrQueryable mingru.Queryable, id uint64) (uint, error) {
	var result uint
	err := mrQueryable.QueryRow("SELECT `post_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeUserStats) TestSelectThreadCount(mrQueryable mingru.Queryable, id uint64) (uint, error) {
	var result uint
	err := mrQueryable.QueryRow("SELECT `thread_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeUserStats) UpdatePostCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `user_stats` SET `post_count` = `post_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeUserStats) UpdateThreadCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `user_stats` SET `thread_count` = `thread_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeUserStats) UpdateThreadMsgCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `user_stats` SET `thread_msg_count` = `thread_msg_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
