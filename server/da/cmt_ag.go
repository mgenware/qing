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
	"fmt"
	"time"

	"github.com/mgenware/mingru-go-lib"
)

type TableTypeCmt struct {
}

var Cmt = &TableTypeCmt{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeCmt) MingruSQLName() string {
	return "cmt"
}

// ------------ Actions ------------

func (mrTable *TableTypeCmt) DeleteCore(mrQueryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `cmt` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeCmt) EditCmt(mrQueryable mingru.Queryable, id uint64, userID uint64, contentHTML string, rawModifiedAt time.Time, sanitizedStub int) error {
	result, err := mrQueryable.Exec("UPDATE `cmt` SET `content` = ?, `modified_at` = ? WHERE (`id` = ? AND `user_id` = ?)", contentHTML, rawModifiedAt, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeCmt) EditReply(mrQueryable mingru.Queryable, id uint64, userID uint64, contentHTML string, rawModifiedAt time.Time, sanitizedStub int) error {
	result, err := mrQueryable.Exec("UPDATE `cmt` SET `content` = ?, `modified_at` = ? WHERE (`id` = ? AND `user_id` = ?)", contentHTML, rawModifiedAt, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeCmt) EraseCmt(mrQueryable mingru.Queryable, id uint64, userID uint64, delFlag uint8) error {
	result, err := mrQueryable.Exec("UPDATE `cmt` SET `del_flag` = ?, `content` =  WHERE (`id` = ? AND `user_id` = ?)", delFlag, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypeCmt) InsertCmt(mrQueryable mingru.Queryable, contentHTML string, userID uint64, hostID uint64, hostType uint8) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `cmt` (`parent_id`, `content`, `user_id`, `reply_count`, `likes`, `created_at`, `modified_at`, `del_flag`, `host_id`, `host_type`) VALUES (NULL, ?, ?, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, ?, ?)", contentHTML, userID, hostID, hostType)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *TableTypeCmt) InsertReply(mrQueryable mingru.Queryable, parentID uint64, contentHTML string, userID uint64, hostID uint64, hostType uint8) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `cmt` (`parent_id`, `content`, `user_id`, `reply_count`, `likes`, `created_at`, `modified_at`, `del_flag`, `host_id`, `host_type`) VALUES (?, ?, ?, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, ?, ?)", parentID, contentHTML, userID, hostID, hostType)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

type CmtTableMemLockedGetCmtDataForDeletionResult struct {
	ParentID   *uint64 `json:"parentID,omitempty"`
	ReplyCount uint    `json:"replyCount,omitempty"`
}

func (mrTable *TableTypeCmt) MemLockedGetCmtDataForDeletion(mrQueryable mingru.Queryable, id uint64) (CmtTableMemLockedGetCmtDataForDeletionResult, error) {
	var result CmtTableMemLockedGetCmtDataForDeletionResult
	err := mrQueryable.QueryRow("SELECT `parent_id`, `reply_count` FROM `cmt` WHERE `id` = ? LOCK IN SHARE MODE", id).Scan(&result.ParentID, &result.ReplyCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeCmt) SelectCmtSource(mrQueryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := mrQueryable.QueryRow("SELECT `content` FROM `cmt` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeCmt) SelectReplies(mrQueryable mingru.Queryable, parentID *uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `cmt`.`id`, `cmt`.`content`, `cmt`.`created_at`, `cmt`.`modified_at`, `cmt`.`reply_count`, `cmt`.`likes`, `cmt`.`user_id`, `join_1`.`name`, `join_1`.`icon_name` FROM `cmt` AS `cmt` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `cmt`.`user_id` WHERE `cmt`.`parent_id` = ? ORDER BY `cmt`.`likes` DESC, `cmt`.`created_at` DESC LIMIT ? OFFSET ?", parentID, limit, offset)
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

func (mrTable *TableTypeCmt) SelectRepliesWithLike(mrQueryable mingru.Queryable, viewerUserID uint64, parentID *uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `cmt`.`id`, `cmt`.`content`, `cmt`.`created_at`, `cmt`.`modified_at`, `cmt`.`reply_count`, `cmt`.`likes`, `cmt`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `join_2`.`user_id` AS `has_liked` FROM `cmt` AS `cmt` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `cmt`.`user_id` LEFT JOIN `cmt_like` AS `join_2` ON `join_2`.`host_id` = `cmt`.`id` AND `join_2`.`user_id` = ? WHERE `cmt`.`parent_id` = ? ORDER BY `cmt`.`likes` DESC, `cmt`.`created_at` DESC LIMIT ? OFFSET ?", viewerUserID, parentID, limit, offset)
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

func (mrTable *TableTypeCmt) SelectReplySource(mrQueryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := mrQueryable.QueryRow("SELECT `content` FROM `cmt` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *TableTypeCmt) UpdateReplyCount(mrQueryable mingru.Queryable, id uint64, offset int) error {
	result, err := mrQueryable.Exec("UPDATE `cmt` SET `reply_count` = `reply_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
