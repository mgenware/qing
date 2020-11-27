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
	PostCount       uint `json:"postCount,omitempty"`
	DiscussionCount uint `json:"discussionCount,omitempty"`
}

// SelectStats ...
func (da *TableTypeUserStats) SelectStats(queryable mingru.Queryable, id uint64) (*UserStatsTableSelectStatsResult, error) {
	result := &UserStatsTableSelectStatsResult{}
	err := queryable.QueryRow("SELECT `post_count`, `discussion_count` FROM `user_stats` WHERE `id` = ?", id).Scan(&result.PostCount, &result.DiscussionCount)
	if err != nil {
		return nil, err
	}
	return result, nil
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
