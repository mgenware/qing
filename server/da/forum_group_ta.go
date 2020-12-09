/******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"time"

	"github.com/mgenware/mingru-go-lib"
)

// TableTypeForumGroup ...
type TableTypeForumGroup struct {
}

// ForumGroup ...
var ForumGroup = &TableTypeForumGroup{}

// ------------ Actions ------------

// DeleteGroup ...
func (da *TableTypeForumGroup) DeleteGroup(queryable mingru.Queryable, id uint64) error {
	result, err := queryable.Exec("DELETE FROM `forum_group` WHERE `id` = ?", id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertGroup ...
func (da *TableTypeForumGroup) InsertGroup(queryable mingru.Queryable, name string, shortDesc string, longDesc string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `forum_group` (`name`, `short_desc`, `long_desc`, `order_index`, `created_at`, `forum_count`) VALUES (?, ?, ?, 0, UTC_TIMESTAMP(), 0)", name, shortDesc, longDesc)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

// ForumGroupTableSelectGroupResult ...
type ForumGroupTableSelectGroupResult struct {
	ID           uint64    `json:"ID,omitempty"`
	Name         string    `json:"name,omitempty"`
	ShortDesc    string    `json:"shortDesc,omitempty"`
	LongDescHTML string    `json:"longDescHTML,omitempty"`
	CreatedAt    time.Time `json:"createdAt,omitempty"`
	ForumCount   uint      `json:"forumCount,omitempty"`
}

// SelectGroup ...
func (da *TableTypeForumGroup) SelectGroup(queryable mingru.Queryable, id uint64) (*ForumGroupTableSelectGroupResult, error) {
	result := &ForumGroupTableSelectGroupResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `short_desc`, `long_desc`, `created_at`, `forum_count` FROM `forum_group` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.ShortDesc, &result.LongDescHTML, &result.CreatedAt, &result.ForumCount)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateInfo ...
func (da *TableTypeForumGroup) UpdateInfo(queryable mingru.Queryable, id uint64, name string, shortDesc string, longDesc string) error {
	result, err := queryable.Exec("UPDATE `forum_group` SET `name` = ?, `short_desc` = ?, `long_desc` = ? WHERE `id` = ?", name, shortDesc, longDesc, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
