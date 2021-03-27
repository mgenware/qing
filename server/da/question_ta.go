/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
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

// TableTypeQuestion ...
type TableTypeQuestion struct {
}

// Question ...
var Question = &TableTypeQuestion{}

// ------------ Actions ------------

// QuestionTableDeleteCmtChild1Result ...
type QuestionTableDeleteCmtChild1Result struct {
	HostID     uint64 `json:"hostID,omitempty"`
	ReplyCount uint   `json:"replyCount,omitempty"`
}

func (da *TableTypeQuestion) deleteCmtChild1(queryable mingru.Queryable, id uint64) (QuestionTableDeleteCmtChild1Result, error) {
	var result QuestionTableDeleteCmtChild1Result
	err := queryable.QueryRow("SELECT `question_cmt`.`host_id` AS `host_id`, `join_1`.`reply_count` AS `ReplyCount` FROM `question_cmt` AS `question_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `question_cmt`.`cmt_id` WHERE `question_cmt`.`cmt_id` = ?", id).Scan(&result.HostID, &result.ReplyCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeQuestion) deleteCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) deleteCmtChild3(queryable mingru.Queryable, hostID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ?", replyCount, hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypeQuestion) DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
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

func (da *TableTypeQuestion) deleteItemChild1(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `question` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) deleteItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateQuestionCount(queryable, userID, -1)
}

// DeleteItem ...
func (da *TableTypeQuestion) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		err = da.deleteItemChild1(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteItemChild2(tx, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// QuestionTableDeleteReplyChild1Result ...
type QuestionTableDeleteReplyChild1Result struct {
	ParentHostID uint64 `json:"parentHostID,omitempty"`
	ParentID     uint64 `json:"parentID,omitempty"`
}

func (da *TableTypeQuestion) deleteReplyChild1(queryable mingru.Queryable, id uint64) (QuestionTableDeleteReplyChild1Result, error) {
	var result QuestionTableDeleteReplyChild1Result
	err := queryable.QueryRow("SELECT `reply`.`parent_id` AS `parent_id`, `join_2`.`host_id` AS `ParentHostID` FROM `reply` AS `reply` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `reply`.`parent_id` INNER JOIN `question_cmt` AS `join_2` ON `join_2`.`cmt_id` = `join_1`.`id` WHERE `reply`.`id` = ?", id).Scan(&result.ParentID, &result.ParentHostID)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeQuestion) deleteReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) deleteReplyChild4(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, -1)
}

// DeleteReply ...
func (da *TableTypeQuestion) DeleteReply(db *sql.DB, id uint64, userID uint64) error {
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
func (da *TableTypeQuestion) EditItem(queryable mingru.Queryable, id uint64, userID uint64, title string, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `question` SET `modified_at` = UTC_TIMESTAMP(), `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?", title, content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) insertCmtChild1(queryable mingru.Queryable, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `reply_count`, `likes`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0)", content, userID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeQuestion) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `question_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (da *TableTypeQuestion) insertCmtChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypeQuestion) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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

func (da *TableTypeQuestion) insertItemChild1(queryable mingru.Queryable, forumID *uint64, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `question` (`forum_id`, `title`, `content`, `user_id`, `created_at`, `modified_at`, `cmt_count`, `reply_count`, `last_replied_at`, `votes`, `up_votes`, `down_votes`) VALUES (?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, NULL, 0, 0, 0)", forumID, title, content, userID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeQuestion) insertItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateQuestionCount(queryable, userID, 1)
}

// InsertItem ...
func (da *TableTypeQuestion) InsertItem(db *sql.DB, forumID *uint64, title string, content string, userID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := da.insertItemChild1(tx, forumID, title, content, userID)
		if err != nil {
			return err
		}
		err = da.insertItemChild2(tx, userID)
		if err != nil {
			return err
		}
		insertedIDExported = insertedID
		return nil
	})
	return insertedIDExported, txErr
}

func (da *TableTypeQuestion) insertReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, 1)
}

func (da *TableTypeQuestion) insertReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypeQuestion) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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
func (da *TableTypeQuestion) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `question_cmt`.`cmt_id` AS `cmt_id`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `created_at`, `join_1`.`modified_at` AS `modified_at`, `join_1`.`reply_count` AS `reply_count`, `join_1`.`likes` AS `likes`, `join_1`.`user_id` AS `user_id`, `join_2`.`name` AS `user_name`, `join_2`.`icon_name` AS `user_icon_name` FROM `question_cmt` AS `question_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `question_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `question_cmt`.`host_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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

// QuestionTableSelectItemByIDResult ...
type QuestionTableSelectItemByIDResult struct {
	CmtCount     uint      `json:"cmtCount,omitempty"`
	ContentHTML  string    `json:"contentHTML,omitempty"`
	CreatedAt    time.Time `json:"createdAt,omitempty"`
	ID           uint64    `json:"-"`
	ModifiedAt   time.Time `json:"modifiedAt,omitempty"`
	ReplyCount   uint      `json:"replyCount,omitempty"`
	Title        string    `json:"title,omitempty"`
	UserIconName string    `json:"-"`
	UserID       uint64    `json:"-"`
	UserName     string    `json:"-"`
}

// SelectItemByID ...
func (da *TableTypeQuestion) SelectItemByID(queryable mingru.Queryable, id uint64) (QuestionTableSelectItemByIDResult, error) {
	var result QuestionTableSelectItemByIDResult
	err := queryable.QueryRow("SELECT `question`.`id` AS `id`, `question`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `question`.`created_at` AS `created_at`, `question`.`modified_at` AS `modified_at`, `question`.`content` AS `content`, `question`.`title` AS `title`, `question`.`cmt_count` AS `cmt_count`, `question`.`reply_count` AS `reply_count` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` WHERE `question`.`id` = ?", id).Scan(&result.ID, &result.UserID, &result.UserName, &result.UserIconName, &result.CreatedAt, &result.ModifiedAt, &result.ContentHTML, &result.Title, &result.CmtCount, &result.ReplyCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

// QuestionTableSelectItemsForPostCenterOrderBy1 ...
const (
	QuestionTableSelectItemsForPostCenterOrderBy1CreatedAt = iota
	QuestionTableSelectItemsForPostCenterOrderBy1ReplyCount
)

// QuestionTableSelectItemsForPostCenterResult ...
type QuestionTableSelectItemsForPostCenterResult struct {
	CreatedAt  time.Time `json:"createdAt,omitempty"`
	ID         uint64    `json:"-"`
	ModifiedAt time.Time `json:"modifiedAt,omitempty"`
	ReplyCount uint      `json:"replyCount,omitempty"`
	Title      string    `json:"title,omitempty"`
}

// SelectItemsForPostCenter ...
func (da *TableTypeQuestion) SelectItemsForPostCenter(queryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]QuestionTableSelectItemsForPostCenterResult, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case QuestionTableSelectItemsForPostCenterOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case QuestionTableSelectItemsForPostCenterOrderBy1ReplyCount:
		orderBy1SQL = "`reply_count`"
	default:
		err := fmt.Errorf("Unsupported value %v", orderBy1)
		return nil, false, err
	}
	if orderBy1Desc {
		orderBy1SQL += " DESC"
	}

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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `title`, `reply_count` FROM `question` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]QuestionTableSelectItemsForPostCenterResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item QuestionTableSelectItemsForPostCenterResult
			err = rows.Scan(&item.ID, &item.CreatedAt, &item.ModifiedAt, &item.Title, &item.ReplyCount)
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

// QuestionTableSelectItemsForUserProfileResult ...
type QuestionTableSelectItemsForUserProfileResult struct {
	CreatedAt  time.Time `json:"createdAt,omitempty"`
	ID         uint64    `json:"-"`
	ModifiedAt time.Time `json:"modifiedAt,omitempty"`
	Title      string    `json:"title,omitempty"`
}

// SelectItemsForUserProfile ...
func (da *TableTypeQuestion) SelectItemsForUserProfile(queryable mingru.Queryable, userID uint64, page int, pageSize int) ([]QuestionTableSelectItemsForUserProfileResult, bool, error) {
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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `title` FROM `question` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]QuestionTableSelectItemsForUserProfileResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item QuestionTableSelectItemsForUserProfileResult
			err = rows.Scan(&item.ID, &item.CreatedAt, &item.ModifiedAt, &item.Title)
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
func (da *TableTypeQuestion) SelectItemSrc(queryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := queryable.QueryRow("SELECT `title`, `content` FROM `question` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Title, &result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UpdateMsgCount ...
func (da *TableTypeQuestion) UpdateMsgCount(queryable mingru.Queryable, id uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `question` SET `reply_count` = `reply_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
