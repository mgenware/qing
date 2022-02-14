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

type TableTypeDiscussionMsg struct {
}

var DiscussionMsg = &TableTypeDiscussionMsg{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeDiscussionMsg) MingruSQLName() string {
	return "discussion_msg"
}

// ------------ Actions ------------

func (mrTable *TableTypeDiscussionMsg) deleteItemChild1(mrQueryable mingru.Queryable, id uint64) (uint64, error) {
	var result uint64
	err := mrQueryable.QueryRow("SELECT `discussion_id` FROM `discussion_msg` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeDiscussionMsg) deleteItemChild2(mrQueryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `discussion_msg` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeDiscussionMsg) deleteItemChild3(mrQueryable mingru.Queryable, id uint64) error {
	return Discussion.UpdateMsgCount(mrQueryable, id, -1)
}

func (mrTable *TableTypeDiscussionMsg) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		discussionID, err := mrTable.deleteItemChild1(tx, id)
		if err != nil {
			return err
		}
		err = mrTable.deleteItemChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = mrTable.deleteItemChild3(tx, discussionID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

func (mrTable *TableTypeDiscussionMsg) EditItem(mrQueryable mingru.Queryable, id uint64, userID uint64, contentHTML string, rawModifiedAt time.Time, sanitizedStub int) error {
	result, err := mrQueryable.Exec("UPDATE `discussion_msg` SET `content` = ?, `modified_at` = ? WHERE (`id` = ? AND `user_id` = ?)", contentHTML, rawModifiedAt, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeDiscussionMsg) insertItemChild1(mrQueryable mingru.Queryable, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time, discussionID uint64) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `discussion_msg` (`content`, `user_id`, `created_at`, `modified_at`, `discussion_id`, `cmt_count`, `votes`, `up_votes`, `down_votes`) VALUES (?, ?, ?, ?, ?, 0, 0, 0, 0)", contentHTML, userID, rawCreatedAt, rawModifiedAt, discussionID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *TableTypeDiscussionMsg) insertItemChild2(mrQueryable mingru.Queryable, id uint64) error {
	return Discussion.UpdateMsgCount(mrQueryable, id, 1)
}

func (mrTable *TableTypeDiscussionMsg) InsertItem(db *sql.DB, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time, discussionID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := mrTable.insertItemChild1(tx, contentHTML, userID, rawCreatedAt, rawModifiedAt, discussionID)
		if err != nil {
			return err
		}
		err = mrTable.insertItemChild2(tx, discussionID)
		if err != nil {
			return err
		}
		insertedIDExported = insertedID
		return nil
	})
	return insertedIDExported, txErr
}

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

func (mrTable *TableTypeDiscussionMsg) SelectItemsByDiscussion(mrQueryable mingru.Queryable, discussionID uint64, page int, pageSize int) ([]DiscussionMsgTableSelectItemsByDiscussionResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `discussion_msg`.`id`, `discussion_msg`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `discussion_msg`.`created_at`, `discussion_msg`.`modified_at`, `discussion_msg`.`content`, `discussion_msg`.`cmt_count` FROM `discussion_msg` AS `discussion_msg` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `discussion_msg`.`user_id` WHERE `discussion_msg`.`discussion_id` = ? ORDER BY `discussion_msg`.`created_at` LIMIT ? OFFSET ?", discussionID, limit, offset)
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

func (mrTable *TableTypeDiscussionMsg) SelectItemSrc(mrQueryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := mrQueryable.QueryRow("SELECT `content` FROM `discussion_msg` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeDiscussionMsg) TestUpdateDates(mrQueryable mingru.Queryable, id uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) error {
	result, err := mrQueryable.Exec("UPDATE `discussion_msg` SET `created_at` = ?, `modified_at` = ? WHERE `id` = ?", rawCreatedAt, rawModifiedAt, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
