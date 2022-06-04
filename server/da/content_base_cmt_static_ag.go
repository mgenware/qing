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

type ContentBaseCmtStaticAGType struct {
}

var ContentBaseCmtStatic = &ContentBaseCmtStaticAGType{}

// ------------ Actions ------------

func (mrTable *ContentBaseCmtStaticAGType) insertCmtChild2Core(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, cmtID uint64, hostID uint64) error {
	_, err := mrQueryable.Exec("INSERT INTO "+string(contentBaseCmtTableParam)+" (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (mrTable *ContentBaseCmtStaticAGType) insertCmtChild2(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, cmtID uint64, hostID uint64) error {
	return mrTable.insertCmtChild2Core(mrQueryable, contentBaseCmtTableParam, cmtID, hostID)
}

func (mrTable *ContentBaseCmtStaticAGType) insertCmtChild3(mrQueryable mingru.Queryable, contentBaseTableParam mingru.Table, id uint64) error {
	return ContentBaseStatic.UpdateCmtCount(mrQueryable, contentBaseTableParam, id, 1)
}

func (mrTable *ContentBaseCmtStaticAGType) InsertCmt(db *sql.DB, contentBaseCmtTableParam mingru.Table, contentBaseTableParam mingru.Table, contentHTML string, userID uint64, hostID uint64, hostType uint8, sanitizedStub int, captStub int) (uint64, error) {
	var cmtIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtID, err := Cmt.InsertCmtTXM(tx, contentHTML, userID, hostID, hostType)
		if err != nil {
			return err
		}
		err = mrTable.insertCmtChild2(tx, contentBaseCmtTableParam, cmtID, hostID)
		if err != nil {
			return err
		}
		err = mrTable.insertCmtChild3(tx, contentBaseTableParam, hostID)
		if err != nil {
			return err
		}
		cmtIDExported = cmtID
		return nil
	})
	return cmtIDExported, txErr
}

func (mrTable *ContentBaseCmtStaticAGType) insertReplyChild2(mrQueryable mingru.Queryable, id uint64) error {
	return Cmt.UpdateReplyCount(mrQueryable, id, 1)
}

func (mrTable *ContentBaseCmtStaticAGType) insertReplyChild3(mrQueryable mingru.Queryable, contentBaseTableParam mingru.Table, hostID uint64) error {
	return ContentBaseStatic.UpdateCmtCount(mrQueryable, contentBaseTableParam, hostID, 1)
}

func (mrTable *ContentBaseCmtStaticAGType) InsertReply(db *sql.DB, contentBaseTableParam mingru.Table, contentHTML string, userID uint64, hostID uint64, hostType uint8, parentID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := Cmt.InsertReplyTXM(tx, contentHTML, userID, hostID, hostType, parentID)
		if err != nil {
			return err
		}
		err = mrTable.insertReplyChild2(tx, parentID)
		if err != nil {
			return err
		}
		err = mrTable.insertReplyChild3(tx, contentBaseTableParam, hostID)
		if err != nil {
			return err
		}
		replyIDExported = replyID
		return nil
	})
	return replyIDExported, txErr
}

type ContentBaseCmtStaticAGSelectRootCmtsOrderBy1 int

const (
	ContentBaseCmtStaticAGSelectRootCmtsOrderBy1Likes ContentBaseCmtStaticAGSelectRootCmtsOrderBy1 = iota
	ContentBaseCmtStaticAGSelectRootCmtsOrderBy1CreatedAt
)

func (mrTable *ContentBaseCmtStaticAGType) SelectRootCmts(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, hostID uint64, page int, pageSize int, orderBy1 ContentBaseCmtStaticAGSelectRootCmtsOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error) {
	var orderBy1SQL string
	var orderBy1SQLFC string
	switch orderBy1 {
	case ContentBaseCmtStaticAGSelectRootCmtsOrderBy1Likes:
		orderBy1SQL = "`join_1`.`likes`"
		orderBy1SQLFC += ", " + "`join_1`.`created_at` DESC"
	case ContentBaseCmtStaticAGSelectRootCmtsOrderBy1CreatedAt:
		orderBy1SQL = "`join_1`.`created_at`"
		orderBy1SQLFC += ", " + "`join_1`.`likes` DESC"
	default:
		err := fmt.Errorf("unsupported value %v", orderBy1)
		return nil, false, err
	}
	if orderBy1Desc {
		orderBy1SQL += " DESC"
	}
	orderBy1SQL += orderBy1SQLFC

	if page <= 0 {
		err := fmt.Errorf("invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := mrQueryable.Query("SELECT `content_base_cmt_table_param`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`cmt_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name` FROM "+string(contentBaseCmtTableParam)+" AS `content_base_cmt_table_param` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `content_base_cmt_table_param`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `content_base_cmt_table_param`.`host_id` = ? ORDER BY "+orderBy1SQL+", `join_1`.`id` LIMIT ? OFFSET ?", hostID, limit, offset)
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

type ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1 int

const (
	ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1Likes ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1 = iota
	ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1CreatedAt
)

func (mrTable *ContentBaseCmtStaticAGType) SelectRootCmtsUserMode(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, viewerUserID uint64, hostID uint64, page int, pageSize int, orderBy1 ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error) {
	var orderBy1SQL string
	var orderBy1SQLFC string
	switch orderBy1 {
	case ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1Likes:
		orderBy1SQL = "`join_1`.`likes`"
		orderBy1SQLFC += ", " + "`join_1`.`created_at` DESC"
	case ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1CreatedAt:
		orderBy1SQL = "`join_1`.`created_at`"
		orderBy1SQLFC += ", " + "`join_1`.`likes` DESC"
	default:
		err := fmt.Errorf("unsupported value %v", orderBy1)
		return nil, false, err
	}
	if orderBy1Desc {
		orderBy1SQL += " DESC"
	}
	orderBy1SQL += orderBy1SQLFC

	if page <= 0 {
		err := fmt.Errorf("invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := mrQueryable.Query("SELECT `content_base_cmt_table_param`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`cmt_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name`, `join_3`.`user_id` AS `is_liked` FROM "+string(contentBaseCmtTableParam)+" AS `content_base_cmt_table_param` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `content_base_cmt_table_param`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` LEFT JOIN `cmt_like` AS `join_3` ON `join_3`.`host_id` = `content_base_cmt_table_param`.`cmt_id` AND `join_3`.`user_id` = ? WHERE `content_base_cmt_table_param`.`host_id` = ? ORDER BY "+orderBy1SQL+", `join_1`.`id` LIMIT ? OFFSET ?", viewerUserID, hostID, limit, offset)
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

type ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1 int

const (
	ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1Likes ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1 = iota
	ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1CreatedAt
)

func (mrTable *ContentBaseCmtStaticAGType) SelectRootCmtsUserModeFilterMode(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, viewerUserID uint64, hostID uint64, excluded []uint64, page int, pageSize int, orderBy1 ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error) {
	if len(excluded) == 0 {
		return nil, false, fmt.Errorf("the array argument `excluded` cannot be empty")
	}
	var orderBy1SQL string
	var orderBy1SQLFC string
	switch orderBy1 {
	case ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1Likes:
		orderBy1SQL = "`join_1`.`likes`"
		orderBy1SQLFC += ", " + "`join_1`.`created_at` DESC"
	case ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1CreatedAt:
		orderBy1SQL = "`join_1`.`created_at`"
		orderBy1SQLFC += ", " + "`join_1`.`likes` DESC"
	default:
		err := fmt.Errorf("unsupported value %v", orderBy1)
		return nil, false, err
	}
	if orderBy1Desc {
		orderBy1SQL += " DESC"
	}
	orderBy1SQL += orderBy1SQLFC

	if page <= 0 {
		err := fmt.Errorf("invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	var queryParams []interface{}
	queryParams = append(queryParams, viewerUserID)
	queryParams = append(queryParams, hostID)
	for _, item := range excluded {
		queryParams = append(queryParams, item)
	}
	queryParams = append(queryParams, limit)
	queryParams = append(queryParams, offset)
	rows, err := mrQueryable.Query("SELECT `content_base_cmt_table_param`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`cmt_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name`, `join_3`.`user_id` AS `is_liked` FROM "+string(contentBaseCmtTableParam)+" AS `content_base_cmt_table_param` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `content_base_cmt_table_param`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` LEFT JOIN `cmt_like` AS `join_3` ON `join_3`.`host_id` = `content_base_cmt_table_param`.`cmt_id` AND `join_3`.`user_id` = ? WHERE (`content_base_cmt_table_param`.`host_id` = ? AND `join_1`.`id` NOT IN ("+mingru.InputPlaceholders(len(excluded))+")) ORDER BY "+orderBy1SQL+", `join_1`.`id` LIMIT ? OFFSET ?", queryParams...)
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
