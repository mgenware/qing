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

// TableTypeDiscussionMsg ...
type TableTypeDiscussionMsg struct {
}

// DiscussionMsg ...
var DiscussionMsg = &TableTypeDiscussionMsg{}

// ------------ Actions ------------

// DiscussionMsgTableDeleteCmtChild1Result ...
type DiscussionMsgTableDeleteCmtChild1Result struct {
	HostID     uint64 `json:"hostID,omitempty"`
	ReplyCount uint   `json:"replyCount,omitempty"`
}

func (da *TableTypeDiscussionMsg) deleteCmtChild1(queryable mingru.Queryable, id uint64) (DiscussionMsgTableDeleteCmtChild1Result, error) {
	var result DiscussionMsgTableDeleteCmtChild1Result
	err := queryable.QueryRow("SELECT `discussion_msg_cmt`.`host_id` AS `host_id`, `join_1`.`reply_count` AS `ReplyCount` FROM `discussion_msg_cmt` AS `discussion_msg_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `discussion_msg_cmt`.`cmt_id` WHERE `discussion_msg_cmt`.`cmt_id` = ?", id).Scan(&result.HostID, &result.ReplyCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeDiscussionMsg) deleteCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeDiscussionMsg) deleteCmtChild3(queryable mingru.Queryable, hostID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `discussion_msg` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ?", replyCount, hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypeDiscussionMsg) DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
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

func (da *TableTypeDiscussionMsg) deleteItemChild1(queryable mingru.Queryable, id uint64) (uint64, error) {
	var result uint64
	err := queryable.QueryRow("SELECT `discussion_id` FROM `discussion_msg` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeDiscussionMsg) deleteItemChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `discussion_msg` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeDiscussionMsg) deleteItemChild3(queryable mingru.Queryable, id uint64) error {
	return Discussion.UpdateMsgCount(queryable, id, -1)
}

// DeleteItem ...
func (da *TableTypeDiscussionMsg) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		discussionID, err := da.deleteItemChild1(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteItemChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteItemChild3(tx, discussionID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// DiscussionMsgTableDeleteReplyChild1Result ...
type DiscussionMsgTableDeleteReplyChild1Result struct {
	ParentHostID uint64 `json:"parentHostID,omitempty"`
	ParentID     uint64 `json:"parentID,omitempty"`
}

func (da *TableTypeDiscussionMsg) deleteReplyChild1(queryable mingru.Queryable, id uint64) (DiscussionMsgTableDeleteReplyChild1Result, error) {
	var result DiscussionMsgTableDeleteReplyChild1Result
	err := queryable.QueryRow("SELECT `reply`.`parent_id` AS `parent_id`, `join_2`.`host_id` AS `ParentHostID` FROM `reply` AS `reply` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `reply`.`parent_id` INNER JOIN `discussion_msg_cmt` AS `join_2` ON `join_2`.`cmt_id` = `join_1`.`id` WHERE `reply`.`id` = ?", id).Scan(&result.ParentID, &result.ParentHostID)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeDiscussionMsg) deleteReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `discussion_msg` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeDiscussionMsg) deleteReplyChild4(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, -1)
}

// DeleteReply ...
func (da *TableTypeDiscussionMsg) DeleteReply(db *sql.DB, id uint64, userID uint64) error {
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
func (da *TableTypeDiscussionMsg) EditItem(queryable mingru.Queryable, id uint64, userID uint64, content string, modifiedAt time.Time, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `discussion_msg` SET `content` = ?, `modified_at` = ? WHERE (`id` = ? AND `user_id` = ?)", content, modifiedAt, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeDiscussionMsg) insertCmtChild1(queryable mingru.Queryable, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `reply_count`, `likes`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0)", content, userID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeDiscussionMsg) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `discussion_msg_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (da *TableTypeDiscussionMsg) insertCmtChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `discussion_msg` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypeDiscussionMsg) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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

func (da *TableTypeDiscussionMsg) insertItemChild1(queryable mingru.Queryable, content string, userID uint64, createdAt time.Time, modifiedAt time.Time, discussionID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `discussion_msg` (`content`, `user_id`, `created_at`, `modified_at`, `discussion_id`, `cmt_count`, `votes`, `up_votes`, `down_votes`) VALUES (?, ?, ?, ?, ?, 0, 0, 0, 0)", content, userID, createdAt, modifiedAt, discussionID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeDiscussionMsg) insertItemChild2(queryable mingru.Queryable, id uint64) error {
	return Discussion.UpdateMsgCount(queryable, id, 1)
}

// InsertItem ...
func (da *TableTypeDiscussionMsg) InsertItem(db *sql.DB, content string, userID uint64, createdAt time.Time, modifiedAt time.Time, discussionID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := da.insertItemChild1(tx, content, userID, createdAt, modifiedAt, discussionID)
		if err != nil {
			return err
		}
		err = da.insertItemChild2(tx, discussionID)
		if err != nil {
			return err
		}
		insertedIDExported = insertedID
		return nil
	})
	return insertedIDExported, txErr
}

func (da *TableTypeDiscussionMsg) insertReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, 1)
}

func (da *TableTypeDiscussionMsg) insertReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `discussion_msg` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypeDiscussionMsg) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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
func (da *TableTypeDiscussionMsg) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `discussion_msg_cmt`.`cmt_id` AS `id`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `created_at`, `join_1`.`modified_at` AS `modified_at`, `join_1`.`reply_count` AS `reply_count`, `join_1`.`likes` AS `likes`, `join_1`.`user_id` AS `user_id`, `join_2`.`name` AS `user_name`, `join_2`.`icon_name` AS `user_icon_name` FROM `discussion_msg_cmt` AS `discussion_msg_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `discussion_msg_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `discussion_msg_cmt`.`host_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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
			err = rows.Scan(&item.ID, &item.ContentHTML, &item.RawCreatedAt, &item.RawModifiedAt, &item.ReplyCount, &item.Likes, &item.UserID, &item.UserName, &item.UserIconName)
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

// SelectCmtsWithLike ...
func (da *TableTypeDiscussionMsg) SelectCmtsWithLike(queryable mingru.Queryable, viewerUserID uint64, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `discussion_msg_cmt`.`cmt_id` AS `id`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `created_at`, `join_1`.`modified_at` AS `modified_at`, `join_1`.`reply_count` AS `reply_count`, `join_1`.`likes` AS `likes`, `join_1`.`user_id` AS `user_id`, `join_2`.`name` AS `user_name`, `join_2`.`icon_name` AS `user_icon_name`, `join_3`.`user_id` AS `hasLiked` FROM `discussion_msg_cmt` AS `discussion_msg_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `discussion_msg_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` LEFT JOIN `cmt_like` AS `join_3` ON `join_3`.`host_id` = `discussion_msg_cmt`.`cmt_id` AND `join_3`.`user_id` = ? WHERE `discussion_msg_cmt`.`host_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", viewerUserID, hostID, limit, offset)
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
			err = rows.Scan(&item.ID, &item.ContentHTML, &item.RawCreatedAt, &item.RawModifiedAt, &item.ReplyCount, &item.Likes, &item.UserID, &item.UserName, &item.UserIconName, &item.HasLiked)
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

// DiscussionMsgTableSelectItemsByDiscussionResult ...
type DiscussionMsgTableSelectItemsByDiscussionResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ContentHTML   string    `json:"contentHTML,omitempty"`
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	UserIconName  string    `json:"-"`
	UserID        uint64    `json:"-"`
	UserName      string    `json:"-"`
}

// SelectItemsByDiscussion ...
func (da *TableTypeDiscussionMsg) SelectItemsByDiscussion(queryable mingru.Queryable, discussionID uint64, page int, pageSize int) ([]DiscussionMsgTableSelectItemsByDiscussionResult, bool, error) {
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
	rows, err := queryable.Query("SELECT `discussion_msg`.`id` AS `id`, `discussion_msg`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `discussion_msg`.`created_at` AS `created_at`, `discussion_msg`.`modified_at` AS `modified_at`, `discussion_msg`.`content` AS `content`, `discussion_msg`.`cmt_count` AS `cmt_count` FROM `discussion_msg` AS `discussion_msg` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion_msg`.`user_id` WHERE `discussion_msg`.`discussion_id` = ? ORDER BY `created_at` LIMIT ? OFFSET ?", discussionID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]DiscussionMsgTableSelectItemsByDiscussionResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item DiscussionMsgTableSelectItemsByDiscussionResult
			err = rows.Scan(&item.ID, &item.UserID, &item.UserName, &item.UserIconName, &item.RawCreatedAt, &item.RawModifiedAt, &item.ContentHTML, &item.CmtCount)
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
func (da *TableTypeDiscussionMsg) SelectItemSrc(queryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := queryable.QueryRow("SELECT `content` FROM `discussion_msg` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// TestUpdateDates ...
func (da *TableTypeDiscussionMsg) TestUpdateDates(queryable mingru.Queryable, id uint64, createdAt time.Time, modifiedAt time.Time) error {
	result, err := queryable.Exec("UPDATE `discussion_msg` SET `created_at` = ?, `modified_at` = ? WHERE `id` = ?", createdAt, modifiedAt, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
