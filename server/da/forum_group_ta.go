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
func (da *TableTypeForumGroup) InsertGroup(queryable mingru.Queryable, name string, desc string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `forum_group` (`name`, `desc`, `order_index`, `created_at`, `forum_count`) VALUES (?, ?, 0, UTC_TIMESTAMP(), 0)", name, desc)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

// ForumGroupTableSelectGroupResult ...
type ForumGroupTableSelectGroupResult struct {
	CreatedAt  time.Time `json:"createdAt,omitempty"`
	DescHTML   string    `json:"descHTML,omitempty"`
	ForumCount uint      `json:"forumCount,omitempty"`
	ID         uint64    `json:"ID,omitempty"`
	Name       string    `json:"name,omitempty"`
}

// SelectGroup ...
func (da *TableTypeForumGroup) SelectGroup(queryable mingru.Queryable, id uint64) (*ForumGroupTableSelectGroupResult, error) {
	result := &ForumGroupTableSelectGroupResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `desc`, `created_at`, `forum_count` FROM `forum_group` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.DescHTML, &result.CreatedAt, &result.ForumCount)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateInfo ...
func (da *TableTypeForumGroup) UpdateInfo(queryable mingru.Queryable, id uint64, name string, desc string) error {
	result, err := queryable.Exec("UPDATE `forum_group` SET `name` = ?, `desc` = ? WHERE `id` = ?", name, desc, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
