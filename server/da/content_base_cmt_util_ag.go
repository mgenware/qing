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

	"github.com/mgenware/mingru-go-lib"
)

type TableTypeContentBaseCmtUtil struct {
}

var ContentBaseCmtUtil = &TableTypeContentBaseCmtUtil{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeContentBaseCmtUtil) MingruSQLName() string {
	return "content_base_cmt_util"
}

// ------------ Actions ------------

func (mrTable *TableTypeContentBaseCmtUtil) insertCmtChild2(mrQueryable mingru.Queryable, cmtRelationTable mingru.Table, cmtID uint64, hostID uint64) error {
	_, err := mrQueryable.Exec("INSERT INTO "+cmtRelationTable.MingruSQLName()+" (`cmt_id`, `host_id`) VALUES (?, ?)", cmtRelationTable, cmtID, hostID)
	return err
}

func (mrTable *TableTypeContentBaseCmtUtil) insertCmtChild3(mrQueryable mingru.Queryable, contentBaseTable mingru.Table, id uint64) error {
	return ContentBaseUtil.UpdateCmtCount(mrQueryable, contentBaseTable, id, 1)
}

func (mrTable *TableTypeContentBaseCmtUtil) InsertCmt(db *sql.DB, contentHTML string, userID uint64, hostID uint64, hostType uint8, cmtRelationTable mingru.Table, contentBaseTable mingru.Table, sanitizedStub int, captStub int) (uint64, error) {
	var cmtIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtID, err := Cmt.InsertCmt(tx, contentHTML, userID, hostID, hostType)
		if err != nil {
			return err
		}
		err = mrTable.insertCmtChild2(tx, cmtRelationTable, cmtID, hostID)
		if err != nil {
			return err
		}
		err = mrTable.insertCmtChild3(tx, contentBaseTable, hostID)
		if err != nil {
			return err
		}
		cmtIDExported = cmtID
		return nil
	})
	return cmtIDExported, txErr
}

func (mrTable *TableTypeContentBaseCmtUtil) insertReplyChild2(mrQueryable mingru.Queryable, id uint64) error {
	return Cmt.UpdateReplyCount(mrQueryable, id, 1)
}

func (mrTable *TableTypeContentBaseCmtUtil) insertReplyChild3(mrQueryable mingru.Queryable, contentBaseTable mingru.Table, hostID uint64) error {
	return ContentBaseUtil.UpdateCmtCount(mrQueryable, contentBaseTable, hostID, 1)
}

func (mrTable *TableTypeContentBaseCmtUtil) InsertReply(db *sql.DB, parentID uint64, contentHTML string, userID uint64, hostID uint64, hostType uint8, contentBaseTable mingru.Table, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := Cmt.InsertReply(tx, parentID, contentHTML, userID, hostID, hostType)
		if err != nil {
			return err
		}
		err = mrTable.insertReplyChild2(tx, parentID)
		if err != nil {
			return err
		}
		err = mrTable.insertReplyChild3(tx, contentBaseTable, hostID)
		if err != nil {
			return err
		}
		replyIDExported = replyID
		return nil
	})
	return replyIDExported, txErr
}

func (mrTable *TableTypeContentBaseCmtUtil) SelectRootCmts(mrQueryable mingru.Queryable, cmtRelationTable mingru.Table, hostID uint64, page int, pageSize int) ([]CmtResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `content_base_cmt_util`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`cmt_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name` FROM "+cmtRelationTable.MingruSQLName()+" AS `content_base_cmt_util` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `content_base_cmt_util`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `content_base_cmt_util`.`host_id` = ? ORDER BY `join_1`.`likes` DESC, `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]CmtResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item CmtResult
			err = rows.Scan(&item.ID, &item.ContentHTML, &item.RawCreatedAt, &item.RawModifiedAt, &item.CmtCount, &item.Likes, &item.UserID, &item.UserName, &item.UserIconName)
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

func (mrTable *TableTypeContentBaseCmtUtil) SelectRootCmtsWithLikes(mrQueryable mingru.Queryable, cmtRelationTable mingru.Table, viewerUserID uint64, hostID uint64, page int, pageSize int) ([]CmtResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `content_base_cmt_util`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`cmt_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name`, `join_3`.`user_id` AS `is_liked` FROM "+cmtRelationTable.MingruSQLName()+" AS `content_base_cmt_util` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `content_base_cmt_util`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` LEFT JOIN `cmt_like` AS `join_3` ON `join_3`.`host_id` = `content_base_cmt_util`.`cmt_id` AND `join_3`.`user_id` = ? WHERE `content_base_cmt_util`.`host_id` = ? ORDER BY `join_1`.`likes` DESC, `join_1`.`created_at` DESC LIMIT ? OFFSET ?", viewerUserID, hostID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]CmtResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item CmtResult
			err = rows.Scan(&item.ID, &item.ContentHTML, &item.RawCreatedAt, &item.RawModifiedAt, &item.CmtCount, &item.Likes, &item.UserID, &item.UserName, &item.UserIconName, &item.IsLiked)
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
