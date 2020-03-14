 /******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
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

// GetParentID ...
func (da *TableTypeReply) GetParentID(queryable dbx.Queryable, id uint64) (uint64, error) {
	var result uint64
	err := queryable.QueryRow("SELECT `parent_id` FROM `reply` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// SelectReplies ...
func (da *TableTypeReply) SelectReplies(queryable dbx.Queryable, parentID uint64, page int, pageSize int) ([]*ReplyData, bool, error) {
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
func (da *TableTypeReply) SelectReplySource(queryable dbx.Queryable, id uint64, userID uint64) (*ReplyTableSelectReplySourceResult, error) {
	result := &ReplyTableSelectReplySourceResult{}
	err := queryable.QueryRow("SELECT `content` FROM `reply` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}
