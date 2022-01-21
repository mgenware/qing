/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
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

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeQuestion) MingruSQLName() string {
	return "question"
}

// ------------ Actions ------------

func (mrTable *TableTypeQuestion) deleteItemChild1(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `question` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeQuestion) deleteItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateQuestionCount(queryable, userID, -1)
}

// DeleteItem ...
func (mrTable *TableTypeQuestion) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		err = mrTable.deleteItemChild1(tx, id, userID)
		if err != nil {
			return err
		}
		err = mrTable.deleteItemChild2(tx, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// EditItem ...
func (mrTable *TableTypeQuestion) EditItem(queryable mingru.Queryable, id uint64, userID uint64, title string, contentHTML string, rawModifiedAt time.Time, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `question` SET `title` = ?, `content` = ?, `modified_at` = ? WHERE (`id` = ? AND `user_id` = ?)", title, contentHTML, rawModifiedAt, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeQuestion) insertCmtChild1(queryable mingru.Queryable, parentID *uint64, contentHTML string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`parent_id`, `content`, `user_id`, `reply_count`, `likes`, `created_at`, `modified_at`) VALUES (?, ?, ?, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP())", parentID, contentHTML, userID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *TableTypeQuestion) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `question_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (mrTable *TableTypeQuestion) insertCmtChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (mrTable *TableTypeQuestion) InsertCmt(db *sql.DB, parentID *uint64, contentHTML string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var cmtIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtID, err := mrTable.insertCmtChild1(tx, parentID, contentHTML, userID)
		if err != nil {
			return err
		}
		err = mrTable.insertCmtChild2(tx, cmtID, hostID)
		if err != nil {
			return err
		}
		err = mrTable.insertCmtChild3(tx, hostID)
		if err != nil {
			return err
		}
		cmtIDExported = cmtID
		return nil
	})
	return cmtIDExported, txErr
}

func (mrTable *TableTypeQuestion) insertItemChild1(queryable mingru.Queryable, forumID *uint64, title string, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `question` (`forum_id`, `title`, `content`, `user_id`, `created_at`, `modified_at`, `cmt_count`, `reply_count`, `last_replied_at`, `likes`) VALUES (?, ?, ?, ?, ?, ?, 0, 0, NULL, 0)", forumID, title, contentHTML, userID, rawCreatedAt, rawModifiedAt)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *TableTypeQuestion) insertItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateQuestionCount(queryable, userID, 1)
}

// InsertItem ...
func (mrTable *TableTypeQuestion) InsertItem(db *sql.DB, forumID *uint64, title string, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := mrTable.insertItemChild1(tx, forumID, title, contentHTML, userID, rawCreatedAt, rawModifiedAt)
		if err != nil {
			return err
		}
		err = mrTable.insertItemChild2(tx, userID)
		if err != nil {
			return err
		}
		insertedIDExported = insertedID
		return nil
	})
	return insertedIDExported, txErr
}

func (mrTable *TableTypeQuestion) insertReplyChild2(queryable mingru.Queryable, id uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, 1)
}

func (mrTable *TableTypeQuestion) insertReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (mrTable *TableTypeQuestion) InsertReply(db *sql.DB, parentID *uint64, contentHTML string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := Cmt.InsertCore(tx, parentID, contentHTML, userID)
		if err != nil {
			return err
		}
		err = mrTable.insertReplyChild2(tx, parentID)
		if err != nil {
			return err
		}
		err = mrTable.insertReplyChild3(tx, hostID)
		if err != nil {
			return err
		}
		replyIDExported = replyID
		return nil
	})
	return replyIDExported, txErr
}

// SelectCmts ...
func (mrTable *TableTypeQuestion) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `question_cmt`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`reply_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name` FROM `question_cmt` AS `question_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `question_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `question_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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
func (mrTable *TableTypeQuestion) SelectCmtsWithLike(queryable mingru.Queryable, viewerUserID uint64, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `question_cmt`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`reply_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name`, `join_3`.`user_id` AS `has_liked` FROM `question_cmt` AS `question_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `question_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` LEFT JOIN `cmt_like` AS `join_3` ON `join_3`.`host_id` = `question_cmt`.`cmt_id` AND `join_3`.`user_id` = ? WHERE `question_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", viewerUserID, hostID, limit, offset)
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

// QuestionTableSelectItemByIDResult ...
type QuestionTableSelectItemByIDResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ContentHTML   string    `json:"contentHTML,omitempty"`
	ForumID       *uint64   `json:"forumID,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	ReplyCount    uint      `json:"replyCount,omitempty"`
	Title         string    `json:"title,omitempty"`
	UserIconName  string    `json:"-"`
	UserID        uint64    `json:"-"`
	UserName      string    `json:"-"`
}

// SelectItemByID ...
func (mrTable *TableTypeQuestion) SelectItemByID(queryable mingru.Queryable, id uint64) (QuestionTableSelectItemByIDResult, error) {
	var result QuestionTableSelectItemByIDResult
	err := queryable.QueryRow("SELECT `question`.`id`, `question`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `question`.`created_at`, `question`.`modified_at`, `question`.`content`, `question`.`forum_id`, `question`.`title`, `question`.`cmt_count`, `question`.`reply_count`, `question`.`likes` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` WHERE `question`.`id` = ?", id).Scan(&result.ID, &result.UserID, &result.UserName, &result.UserIconName, &result.RawCreatedAt, &result.RawModifiedAt, &result.ContentHTML, &result.ForumID, &result.Title, &result.CmtCount, &result.ReplyCount, &result.Likes)
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
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	ReplyCount    uint      `json:"replyCount,omitempty"`
	Title         string    `json:"title,omitempty"`
}

// SelectItemsForPostCenter ...
func (mrTable *TableTypeQuestion) SelectItemsForPostCenter(queryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]QuestionTableSelectItemsForPostCenterResult, bool, error) {
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
			err = rows.Scan(&item.ID, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.ReplyCount)
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
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

// SelectItemsForUserProfile ...
func (mrTable *TableTypeQuestion) SelectItemsForUserProfile(queryable mingru.Queryable, userID uint64, page int, pageSize int) ([]QuestionTableSelectItemsForUserProfileResult, bool, error) {
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
			err = rows.Scan(&item.ID, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title)
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
func (mrTable *TableTypeQuestion) SelectItemSrc(queryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := queryable.QueryRow("SELECT `title`, `content` FROM `question` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.Title, &result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// TestUpdateDates ...
func (mrTable *TableTypeQuestion) TestUpdateDates(queryable mingru.Queryable, id uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) error {
	result, err := queryable.Exec("UPDATE `question` SET `created_at` = ?, `modified_at` = ? WHERE `id` = ?", rawCreatedAt, rawModifiedAt, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateMsgCount ...
func (mrTable *TableTypeQuestion) UpdateMsgCount(queryable mingru.Queryable, id uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `question` SET `reply_count` = `reply_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
