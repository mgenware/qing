/******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"fmt"

	"github.com/mgenware/mingru-go-lib"
)

// TableTypeReply ...
type TableTypeReply struct {
}

// Reply ...
var Reply = &TableTypeReply{}

// ------------ Actions ------------

// DeleteReplyCore ...
func (da *TableTypeReply) DeleteReplyCore(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `reply` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// EditReply ...
func (da *TableTypeReply) EditReply(queryable mingru.Queryable, id uint64, userID uint64, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `reply` SET `content` = ? WHERE `id` = ? AND `user_id` = ?", content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReplyCore ...
func (da *TableTypeReply) InsertReplyCore(queryable mingru.Queryable, content string, userID uint64, toUserID uint64, parentID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `reply` (`content`, `user_id`, `created_at`, `modified_at`, `to_user_id`, `parent_id`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, ?)", content, userID, toUserID, parentID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

// SelectReplies ...
func (da *TableTypeReply) SelectReplies(queryable mingru.Queryable, parentID uint64, page int, pageSize int) ([]*ReplyData, bool, error) {
	if page <= 0 {
		err := fmt.Errorf("Invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("Invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `reply`.`id` AS `id`, `reply`.`content` AS `content`, `reply`.`created_at` AS `createdAt`, `reply`.`modified_at` AS `modifiedAt`, `reply`.`user_id` AS `userID`, `reply`.`to_user_id` AS `toUserID`, `join_1`.`name` AS `userName`, `join_1`.`icon_name` AS `userIconName`, `join_2`.`name` AS `toUserName` FROM `reply` AS `reply` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `reply`.`user_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `reply`.`to_user_id` WHERE `reply`.`parent_id` = ? ORDER BY `reply`.`created_at` DESC LIMIT ? OFFSET ?", parentID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ReplyData, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ReplyData{}
			err = rows.Scan(&item.ID, &item.Content, &item.CreatedAt, &item.ModifiedAt, &item.UserID, &item.ToUserID, &item.UserName, &item.UserIconName, &item.ToUserName)
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
func (da *TableTypeReply) SelectReplySource(queryable mingru.Queryable, id uint64, userID uint64) (*ReplyTableSelectReplySourceResult, error) {
	result := &ReplyTableSelectReplySourceResult{}
	err := queryable.QueryRow("SELECT `content` FROM `reply` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}
