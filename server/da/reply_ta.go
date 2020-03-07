 /******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"time"

	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypeReply ...
type TableTypeReply struct {
}

// Reply ...
var Reply = &TableTypeReply{}

// ------------ Actions ------------

// EditReply ...
func (da *TableTypeReply) EditReply(queryable dbx.Queryable, id uint64, userID uint64, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `reply` SET `content` = ? WHERE `id` = ? AND `user_id` = ?", content, id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// ReplyTableSelectRepliesResult ...
type ReplyTableSelectRepliesResult struct {
	ID           uint64     `json:"-"`
	Content      string     `json:"content,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"userName,omitempty"`
	UserIconName string     `json:"-"`
}

// SelectReplies ...
func (da *TableTypeReply) SelectReplies(queryable dbx.Queryable, parentID uint64, page int, pageSize int) ([]*ReplyTableSelectRepliesResult, bool, error) {
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `reply`.`id` AS `id`, `reply`.`content` AS `content`, `reply`.`created_at` AS `createdAt`, `reply`.`modified_at` AS `modifiedAt`, `reply`.`user_id` AS `userID`, `join_1`.`name` AS `userName`, `join_1`.`icon_name` AS `userIconName` FROM `reply` AS `reply` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `reply`.`user_id` WHERE `reply`.`parent_id` = ? ORDER BY `reply`.`created_at` DESC LIMIT ? OFFSET ?", parentID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ReplyTableSelectRepliesResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ReplyTableSelectRepliesResult{}
			err = rows.Scan(&item.ID, &item.Content, &item.CreatedAt, &item.ModifiedAt, &item.UserID, &item.UserName, &item.UserIconName)
			if err != nil {
				return nil, false, err
			}
			result = append(result, item)
		}
	}
	err = rows.Err()
	if err != nil {
		return nil, false, err
	}
	return result, itemCounter > len(result), nil
}

// ReplyTableSelectReplySourceResult ...
type ReplyTableSelectReplySourceResult struct {
	Content string `json:"content,omitempty"`
}

// SelectReplySource ...
func (da *TableTypeReply) SelectReplySource(queryable dbx.Queryable, id uint64, userID uint64) (*ReplyTableSelectReplySourceResult, error) {
	result := &ReplyTableSelectReplySourceResult{}
	err := queryable.QueryRow("SELECT `content` FROM `reply` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}
