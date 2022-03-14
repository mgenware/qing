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
	AnswerCount     uint `json:"answerCount,omitempty"`
	DiscussionCount uint `json:"discussionCount,omitempty"`
	PostCount       uint `json:"postCount,omitempty"`
	QuestionCount   uint `json:"questionCount,omitempty"`
}

func (mrTable *TableTypeUserStats) SelectStats(mrQueryable mingru.Queryable, id uint64) (UserStatsTableSelectStatsResult, error) {
	var result UserStatsTableSelectStatsResult
	err := mrQueryable.QueryRow("SELECT `post_count`, `discussion_count`, `question_count`, `answer_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result.PostCount, &result.DiscussionCount, &result.QuestionCount, &result.AnswerCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeUserStats) TestSelectAnswerCount(mrQueryable mingru.Queryable, id uint64) (uint, error) {
	var result uint
	err := mrQueryable.QueryRow("SELECT `answer_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeUserStats) TestSelectDiscussionCount(mrQueryable mingru.Queryable, id uint64) (uint, error) {
	var result uint
	err := mrQueryable.QueryRow("SELECT `discussion_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result)
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

func (mrTable *TableTypeUserStats) TestSelectQuestionCount(mrQueryable mingru.Queryable, id uint64) (uint, error) {
	var result uint
	err := mrQueryable.QueryRow("SELECT `question_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeUserStats) UpdateAnswerCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `user_stats` SET `answer_count` = `answer_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeUserStats) UpdateDiscussionCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `user_stats` SET `discussion_count` = `discussion_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeUserStats) UpdatePostCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `user_stats` SET `post_count` = `post_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeUserStats) UpdateQuestionCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `user_stats` SET `question_count` = `question_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
