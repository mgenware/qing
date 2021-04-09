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

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/mgenware/mingru-go-lib"
)

// TableTypeAnswer ...
type TableTypeAnswer struct {
}

// Answer ...
var Answer = &TableTypeAnswer{}

// ------------ Actions ------------

// AnswerTableDeleteCmtChild1Result ...
type AnswerTableDeleteCmtChild1Result struct {
	HostID     uint64 `json:"hostID,omitempty"`
	ReplyCount uint   `json:"replyCount,omitempty"`
}

func (da *TableTypeAnswer) deleteCmtChild1(queryable mingru.Queryable, id uint64) (AnswerTableDeleteCmtChild1Result, error) {
	var result AnswerTableDeleteCmtChild1Result
	err := queryable.QueryRow("SELECT `answer_cmt`.`host_id` AS `host_id`, `join_1`.`reply_count` AS `ReplyCount` FROM `answer_cmt` AS `answer_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `answer_cmt`.`cmt_id` WHERE `answer_cmt`.`cmt_id` = ?", id).Scan(&result.HostID, &result.ReplyCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeAnswer) deleteCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeAnswer) deleteCmtChild3(queryable mingru.Queryable, hostID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `answer` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ?", replyCount, hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypeAnswer) DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		hostIDAndReplyCount, err := da.deleteCmtChild1(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteCmtChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteCmtChild3(tx, hostIDAndReplyCount.HostID, hostIDAndReplyCount.ReplyCount)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

func (da *TableTypeAnswer) deleteItemChild1(queryable mingru.Queryable, id uint64) (uint64, error) {
	var result uint64
	err := queryable.QueryRow("SELECT `question_id` FROM `answer` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeAnswer) deleteItemChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `answer` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeAnswer) deleteItemChild3(queryable mingru.Queryable, id uint64) error {
	return Question.UpdateMsgCount(queryable, id, -1)
}

// DeleteItem ...
func (da *TableTypeAnswer) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		questionID, err := da.deleteItemChild1(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteItemChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteItemChild3(tx, questionID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// AnswerTableDeleteReplyChild1Result ...
type AnswerTableDeleteReplyChild1Result struct {
	ParentHostID uint64 `json:"parentHostID,omitempty"`
	ParentID     uint64 `json:"parentID,omitempty"`
}

func (da *TableTypeAnswer) deleteReplyChild1(queryable mingru.Queryable, id uint64) (AnswerTableDeleteReplyChild1Result, error) {
	var result AnswerTableDeleteReplyChild1Result
	err := queryable.QueryRow("SELECT `reply`.`parent_id` AS `parent_id`, `join_2`.`host_id` AS `ParentHostID` FROM `reply` AS `reply` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `reply`.`parent_id` INNER JOIN `answer_cmt` AS `join_2` ON `join_2`.`cmt_id` = `join_1`.`id` WHERE `reply`.`id` = ?", id).Scan(&result.ParentID, &result.ParentHostID)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeAnswer) deleteReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `answer` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeAnswer) deleteReplyChild4(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, -1)
}

// DeleteReply ...
func (da *TableTypeAnswer) DeleteReply(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtIDAndHostID, err := da.deleteReplyChild1(tx, id)
		if err != nil {
			return err
		}
		err = Reply.DeleteReplyCore(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild3(tx, cmtIDAndHostID.ParentHostID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild4(tx, cmtIDAndHostID.ParentID, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// EditItem ...
func (da *TableTypeAnswer) EditItem(queryable mingru.Queryable, id uint64, userID uint64, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `answer` SET `modified_at` = UTC_TIMESTAMP(), `content` = ? WHERE `id` = ? AND `user_id` = ?", content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeAnswer) insertCmtChild1(queryable mingru.Queryable, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `reply_count`, `likes`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0)", content, userID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeAnswer) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `answer_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (da *TableTypeAnswer) insertCmtChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `answer` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypeAnswer) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var cmtIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtID, err := da.insertCmtChild1(tx, content, userID)
		if err != nil {
			return err
		}
		err = da.insertCmtChild2(tx, cmtID, hostID)
		if err != nil {
			return err
		}
		err = da.insertCmtChild3(tx, hostID)
		if err != nil {
			return err
		}
		cmtIDExported = cmtID
		return nil
	})
	return cmtIDExported, txErr
}

func (da *TableTypeAnswer) insertItemChild1(queryable mingru.Queryable, content string, userID uint64, questionID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `answer` (`content`, `user_id`, `question_id`, `created_at`, `modified_at`, `cmt_count`, `votes`, `up_votes`, `down_votes`) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, 0)", content, userID, questionID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeAnswer) insertItemChild2(queryable mingru.Queryable, id uint64) error {
	return Question.UpdateMsgCount(queryable, id, 1)
}

// InsertItem ...
func (da *TableTypeAnswer) InsertItem(db *sql.DB, content string, userID uint64, questionID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := da.insertItemChild1(tx, content, userID, questionID)
		if err != nil {
			return err
		}
		err = da.insertItemChild2(tx, questionID)
		if err != nil {
			return err
		}
		insertedIDExported = insertedID
		return nil
	})
	return insertedIDExported, txErr
}

func (da *TableTypeAnswer) insertReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, 1)
}

func (da *TableTypeAnswer) insertReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `answer` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypeAnswer) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := Reply.InsertReplyCore(tx, content, userID, toUserID, parentID)
		if err != nil {
			return err
		}
		err = da.insertReplyChild2(tx, parentID, userID)
		if err != nil {
			return err
		}
		err = da.insertReplyChild3(tx, hostID)
		if err != nil {
			return err
		}
		replyIDExported = replyID
		return nil
	})
	return replyIDExported, txErr
}

// SelectCmts ...
func (da *TableTypeAnswer) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `answer_cmt`.`cmt_id` AS `cmt_id`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `created_at`, `join_1`.`modified_at` AS `modified_at`, `join_1`.`reply_count` AS `reply_count`, `join_1`.`likes` AS `likes`, `join_1`.`user_id` AS `user_id`, `join_2`.`name` AS `user_name`, `join_2`.`icon_name` AS `user_icon_name` FROM `answer_cmt` AS `answer_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `answer_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `answer_cmt`.`host_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]CmtData, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item CmtData
			err = rows.Scan(&item.CmtID, &item.ContentHTML, &item.CreatedAt, &item.ModifiedAt, &item.ReplyCount, &item.Likes, &item.UserID, &item.UserName, &item.UserIconName)
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

// AnswerTableSelectItemsByQuestionResult ...
type AnswerTableSelectItemsByQuestionResult struct {
	CmtCount     uint      `json:"cmtCount,omitempty"`
	ContentHTML  string    `json:"contentHTML,omitempty"`
	CreatedAt    time.Time `json:"createdAt,omitempty"`
	ID           uint64    `json:"-"`
	ModifiedAt   time.Time `json:"modifiedAt,omitempty"`
	UserIconName string    `json:"-"`
	UserID       uint64    `json:"-"`
	UserName     string    `json:"-"`
}

// SelectItemsByQuestion ...
func (da *TableTypeAnswer) SelectItemsByQuestion(queryable mingru.Queryable, questionID uint64, page int, pageSize int) ([]AnswerTableSelectItemsByQuestionResult, bool, error) {
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
	rows, err := queryable.Query("SELECT `answer`.`id` AS `id`, `answer`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `answer`.`created_at` AS `created_at`, `answer`.`modified_at` AS `modified_at`, `answer`.`content` AS `content`, `answer`.`cmt_count` AS `cmt_count` FROM `answer` AS `answer` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `answer`.`user_id` WHERE `answer`.`question_id` = ? ORDER BY `created_at` LIMIT ? OFFSET ?", questionID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]AnswerTableSelectItemsByQuestionResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item AnswerTableSelectItemsByQuestionResult
			err = rows.Scan(&item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.CreatedAt, &item.ModifiedAt, &item.ContentHTML, &item.CmtCount)
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

// SelectItemSrc ...
func (da *TableTypeAnswer) SelectItemSrc(queryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := queryable.QueryRow("SELECT `content` FROM `answer` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// AnswerTableTestSelectDatesResult ...
type AnswerTableTestSelectDatesResult struct {
	CreatedAt  time.Time `json:"createdAt,omitempty"`
	ModifiedAt time.Time `json:"modifiedAt,omitempty"`
}

// TestSelectDates ...
func (da *TableTypeAnswer) TestSelectDates(queryable mingru.Queryable, id uint64) (AnswerTableTestSelectDatesResult, error) {
	var result AnswerTableTestSelectDatesResult
	err := queryable.QueryRow("SELECT `created_at`, `modified_at` FROM `answer` WHERE `id` = ?", id).Scan(&result.CreatedAt, &result.ModifiedAt)
	if err != nil {
		return result, err
	}
	return result, nil
}
