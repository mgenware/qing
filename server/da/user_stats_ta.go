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

import "github.com/mgenware/mingru-go-lib"

// TableTypeUserStats ...
type TableTypeUserStats struct {
}

// UserStats ...
var UserStats = &TableTypeUserStats{}

// ------------ Actions ------------

// UserStatsTableSelectStatsResult ...
type UserStatsTableSelectStatsResult struct {
	AnswerCount     uint `json:"answerCount,omitempty"`
	DiscussionCount uint `json:"discussionCount,omitempty"`
	PostCount       uint `json:"postCount,omitempty"`
	QuestionCount   uint `json:"questionCount,omitempty"`
}

// SelectStats ...
func (da *TableTypeUserStats) SelectStats(queryable mingru.Queryable, id uint64) (UserStatsTableSelectStatsResult, error) {
	var result UserStatsTableSelectStatsResult
	err := queryable.QueryRow("SELECT `post_count`, `discussion_count`, `question_count`, `answer_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result.PostCount, &result.DiscussionCount, &result.QuestionCount, &result.AnswerCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UpdateAnswerCount ...
func (da *TableTypeUserStats) UpdateAnswerCount(queryable mingru.Queryable, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `user_stats` SET `answer_count` = `answer_count` + ? WHERE `id` = ?", offset, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateDiscussionCount ...
func (da *TableTypeUserStats) UpdateDiscussionCount(queryable mingru.Queryable, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `user_stats` SET `discussion_count` = `discussion_count` + ? WHERE `id` = ?", offset, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdatePostCount ...
func (da *TableTypeUserStats) UpdatePostCount(queryable mingru.Queryable, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `user_stats` SET `post_count` = `post_count` + ? WHERE `id` = ?", offset, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateQuestionCount ...
func (da *TableTypeUserStats) UpdateQuestionCount(queryable mingru.Queryable, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `user_stats` SET `question_count` = `question_count` + ? WHERE `id` = ?", offset, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
