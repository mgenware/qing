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

// TableTypeDiscussion ...
type TableTypeDiscussion struct {
}

// Discussion ...
var Discussion = &TableTypeDiscussion{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeDiscussion) MingruSQLName() string {
	return "discussion"
}

// ------------ Actions ------------

// DecrementCmtCount ...
func (mrTable *TableTypeDiscussion) DecrementCmtCount(mrQueryable mingru.Queryable, id uint64) error {
	result, err := mrQueryable.Exec("UPDATE `discussion` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ?", id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeDiscussion) deleteItemChild1(mrQueryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `discussion` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeDiscussion) deleteItemChild2(mrQueryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateDiscussionCount(mrQueryable, userID, -1)
}

// DeleteItem ...
func (mrTable *TableTypeDiscussion) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
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
func (mrTable *TableTypeDiscussion) EditItem(mrQueryable mingru.Queryable, id uint64, userID uint64, title string, contentHTML string, rawModifiedAt time.Time, sanitizedStub int) error {
	result, err := mrQueryable.Exec("UPDATE `discussion` SET `title` = ?, `content` = ?, `modified_at` = ? WHERE (`id` = ? AND `user_id` = ?)", title, contentHTML, rawModifiedAt, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// IncrementCmtCount ...
func (mrTable *TableTypeDiscussion) IncrementCmtCount(mrQueryable mingru.Queryable, id uint64) error {
	result, err := mrQueryable.Exec("UPDATE `discussion` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeDiscussion) insertCmtChild2(mrQueryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := mrQueryable.Exec("INSERT INTO `discussion_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}


// InsertCmt ...
func (mrTable *TableTypeDiscussion) InsertCmt(db *sql.DB, contentHTML string, userID uint64, hostID uint64, id uint64, sanitizedStub int, captStub int) (uint64, error) {
	var cmtIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtID, err := Cmt.InsertCmt(tx, contentHTML, userID)
		if err != nil {
			return err
		}
		err = mrTable.insertCmtChild2(tx, cmtID, hostID)
		if err != nil {
			return err
		}
		err = mrTable.IncrementCmtCount(tx, id)
		if err != nil {
			return err
		}
		cmtIDExported = cmtID
		return nil
	})
	return cmtIDExported, txErr
}

func (mrTable *TableTypeDiscussion) insertItemChild1(mrQueryable mingru.Queryable, forumID *uint64, title string, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `discussion` (`forum_id`, `title`, `content`, `user_id`, `created_at`, `modified_at`, `cmt_count`, `reply_count`, `last_replied_at`, `votes`, `up_votes`, `down_votes`) VALUES (?, ?, ?, ?, ?, ?, 0, 0, NULL, 0, 0, 0)", forumID, title, contentHTML, userID, rawCreatedAt, rawModifiedAt)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *TableTypeDiscussion) insertItemChild2(mrQueryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateDiscussionCount(mrQueryable, userID, 1)
}

// InsertItem ...
func (mrTable *TableTypeDiscussion) InsertItem(db *sql.DB, forumID *uint64, title string, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time, sanitizedStub int, captStub int) (uint64, error) {
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

func (mrTable *TableTypeDiscussion) insertReplyChild2(mrQueryable mingru.Queryable, id uint64) error {
	return Cmt.UpdateReplyCount(mrQueryable, id, 1)
}


// InsertReply ...
func (mrTable *TableTypeDiscussion) InsertReply(db *sql.DB, parentID uint64, contentHTML string, userID uint64, id uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := Cmt.InsertReply(tx, parentID, contentHTML, userID)
		if err != nil {
			return err
		}
		err = mrTable.insertReplyChild2(tx, parentID)
		if err != nil {
			return err
		}
		err = mrTable.IncrementCmtCount(tx, id)
		if err != nil {
			return err
		}
		replyIDExported = replyID
		return nil
	})
	return replyIDExported, txErr
}

// DiscussionTableSelectItemByIDResult ...
type DiscussionTableSelectItemByIDResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ContentHTML   string    `json:"contentHTML,omitempty"`
	ForumID       *uint64   `json:"forumID,omitempty"`
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	ReplyCount    uint      `json:"replyCount,omitempty"`
	Title         string    `json:"title,omitempty"`
	UserIconName  string    `json:"-"`
	UserID        uint64    `json:"-"`
	UserName      string    `json:"-"`
}

// SelectItemByID ...
func (mrTable *TableTypeDiscussion) SelectItemByID(mrQueryable mingru.Queryable, id uint64) (DiscussionTableSelectItemByIDResult, error) {
	var result DiscussionTableSelectItemByIDResult
	err := mrQueryable.QueryRow("SELECT `discussion`.`id`, `discussion`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `discussion`.`created_at`, `discussion`.`modified_at`, `discussion`.`content`, `discussion`.`forum_id`, `discussion`.`title`, `discussion`.`cmt_count`, `discussion`.`reply_count` FROM `discussion` AS `discussion` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion`.`user_id` WHERE `discussion`.`id` = ?", id).Scan(&result.ID, &result.UserID, &result.UserName, &result.UserIconName, &result.RawCreatedAt, &result.RawModifiedAt, &result.ContentHTML, &result.ForumID, &result.Title, &result.CmtCount, &result.ReplyCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

// DiscussionTableSelectItemsForPostCenterOrderBy1 ...
const (
	DiscussionTableSelectItemsForPostCenterOrderBy1CreatedAt = iota
	DiscussionTableSelectItemsForPostCenterOrderBy1ReplyCount
)

// DiscussionTableSelectItemsForPostCenterResult ...
type DiscussionTableSelectItemsForPostCenterResult struct {
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	ReplyCount    uint      `json:"replyCount,omitempty"`
	Title         string    `json:"title,omitempty"`
}

// SelectItemsForPostCenter ...
func (mrTable *TableTypeDiscussion) SelectItemsForPostCenter(mrQueryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]DiscussionTableSelectItemsForPostCenterResult, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case DiscussionTableSelectItemsForPostCenterOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case DiscussionTableSelectItemsForPostCenterOrderBy1ReplyCount:
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
	rows, err := mrQueryable.Query("SELECT `id`, `created_at`, `modified_at`, `title`, `reply_count` FROM `discussion` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]DiscussionTableSelectItemsForPostCenterResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item DiscussionTableSelectItemsForPostCenterResult
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

// DiscussionTableSelectItemsForUserProfileResult ...
type DiscussionTableSelectItemsForUserProfileResult struct {
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

// SelectItemsForUserProfile ...
func (mrTable *TableTypeDiscussion) SelectItemsForUserProfile(mrQueryable mingru.Queryable, userID uint64, page int, pageSize int) ([]DiscussionTableSelectItemsForUserProfileResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `id`, `created_at`, `modified_at`, `title` FROM `discussion` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]DiscussionTableSelectItemsForUserProfileResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item DiscussionTableSelectItemsForUserProfileResult
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
func (mrTable *TableTypeDiscussion) SelectItemSrc(mrQueryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := mrQueryable.QueryRow("SELECT `title`, `content` FROM `discussion` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.Title, &result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// TestUpdateDates ...
func (mrTable *TableTypeDiscussion) TestUpdateDates(mrQueryable mingru.Queryable, id uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) error {
	result, err := mrQueryable.Exec("UPDATE `discussion` SET `created_at` = ?, `modified_at` = ? WHERE `id` = ?", rawCreatedAt, rawModifiedAt, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateMsgCount ...
func (mrTable *TableTypeDiscussion) UpdateMsgCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `discussion` SET `reply_count` = `reply_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
