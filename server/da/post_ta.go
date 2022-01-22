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

// TableTypePost ...
type TableTypePost struct {
}

// Post ...
var Post = &TableTypePost{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypePost) MingruSQLName() string {
	return "post"
}

// ------------ Actions ------------

func (mrTable *TableTypePost) deleteItemChild1(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `post` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypePost) deleteItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdatePostCount(queryable, userID, -1)
}

// DeleteItem ...
func (mrTable *TableTypePost) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
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
func (mrTable *TableTypePost) EditItem(queryable mingru.Queryable, id uint64, userID uint64, title string, contentHTML string, rawModifiedAt time.Time, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `post` SET `title` = ?, `content` = ?, `modified_at` = ? WHERE (`id` = ? AND `user_id` = ?)", title, contentHTML, rawModifiedAt, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *TableTypePost) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `post_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (mrTable *TableTypePost) insertCmtChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `post` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (mrTable *TableTypePost) InsertCmt(db *sql.DB, contentHTML string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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
		err = mrTable.insertCmtChild3(tx, hostID)
		if err != nil {
			return err
		}
		cmtIDExported = cmtID
		return nil
	})
	return cmtIDExported, txErr
}

func (mrTable *TableTypePost) insertItemChild1(queryable mingru.Queryable, title string, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `post` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `cmt_count`, `likes`) VALUES (?, ?, ?, ?, ?, 0, 0)", title, contentHTML, userID, rawCreatedAt, rawModifiedAt)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *TableTypePost) insertItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdatePostCount(queryable, userID, 1)
}

// InsertItem ...
func (mrTable *TableTypePost) InsertItem(db *sql.DB, title string, contentHTML string, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := mrTable.insertItemChild1(tx, title, contentHTML, userID, rawCreatedAt, rawModifiedAt)
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

func (mrTable *TableTypePost) insertReplyChild2(queryable mingru.Queryable, id uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, 1)
}

func (mrTable *TableTypePost) insertReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `post` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (mrTable *TableTypePost) InsertReply(db *sql.DB, parentID uint64, contentHTML string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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
func (mrTable *TableTypePost) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `post_cmt`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`reply_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name` FROM `post_cmt` AS `post_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `post_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `post_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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
func (mrTable *TableTypePost) SelectCmtsWithLike(queryable mingru.Queryable, viewerUserID uint64, hostID uint64, page int, pageSize int) ([]CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `post_cmt`.`cmt_id` AS `id`, `join_1`.`content`, `join_1`.`created_at`, `join_1`.`modified_at`, `join_1`.`reply_count`, `join_1`.`likes`, `join_1`.`user_id`, `join_2`.`name`, `join_2`.`icon_name`, `join_3`.`user_id` AS `has_liked` FROM `post_cmt` AS `post_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `post_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` LEFT JOIN `cmt_like` AS `join_3` ON `join_3`.`host_id` = `post_cmt`.`cmt_id` AND `join_3`.`user_id` = ? WHERE `post_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", viewerUserID, hostID, limit, offset)
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

// PostTableSelectItemByIDResult ...
type PostTableSelectItemByIDResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ContentHTML   string    `json:"contentHTML,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
	UserIconName  string    `json:"-"`
	UserID        uint64    `json:"-"`
	UserName      string    `json:"-"`
}

// SelectItemByID ...
func (mrTable *TableTypePost) SelectItemByID(queryable mingru.Queryable, id uint64) (PostTableSelectItemByIDResult, error) {
	var result PostTableSelectItemByIDResult
	err := queryable.QueryRow("SELECT `post`.`id`, `post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `post`.`created_at`, `post`.`modified_at`, `post`.`content`, `post`.`title`, `post`.`cmt_count`, `post`.`likes` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` WHERE `post`.`id` = ?", id).Scan(&result.ID, &result.UserID, &result.UserName, &result.UserIconName, &result.RawCreatedAt, &result.RawModifiedAt, &result.ContentHTML, &result.Title, &result.CmtCount, &result.Likes)
	if err != nil {
		return result, err
	}
	return result, nil
}

// PostTableSelectItemsForPostCenterOrderBy1 ...
const (
	PostTableSelectItemsForPostCenterOrderBy1CreatedAt = iota
	PostTableSelectItemsForPostCenterOrderBy1Likes
	PostTableSelectItemsForPostCenterOrderBy1CmtCount
)

// PostTableSelectItemsForPostCenterResult ...
type PostTableSelectItemsForPostCenterResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

// SelectItemsForPostCenter ...
func (mrTable *TableTypePost) SelectItemsForPostCenter(queryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]PostTableSelectItemsForPostCenterResult, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case PostTableSelectItemsForPostCenterOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case PostTableSelectItemsForPostCenterOrderBy1Likes:
		orderBy1SQL = "`likes`"
	case PostTableSelectItemsForPostCenterOrderBy1CmtCount:
		orderBy1SQL = "`cmt_count`"
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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `title`, `cmt_count`, `likes` FROM `post` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]PostTableSelectItemsForPostCenterResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item PostTableSelectItemsForPostCenterResult
			err = rows.Scan(&item.ID, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.CmtCount, &item.Likes)
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

// PostTableSelectItemsForUserProfileResult ...
type PostTableSelectItemsForUserProfileResult struct {
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

// SelectItemsForUserProfile ...
func (mrTable *TableTypePost) SelectItemsForUserProfile(queryable mingru.Queryable, userID uint64, page int, pageSize int) ([]PostTableSelectItemsForUserProfileResult, bool, error) {
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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `title` FROM `post` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]PostTableSelectItemsForUserProfileResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item PostTableSelectItemsForUserProfileResult
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
func (mrTable *TableTypePost) SelectItemSrc(queryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := queryable.QueryRow("SELECT `title`, `content` FROM `post` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.Title, &result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// TestUpdateDates ...
func (mrTable *TableTypePost) TestUpdateDates(queryable mingru.Queryable, id uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) error {
	result, err := queryable.Exec("UPDATE `post` SET `created_at` = ?, `modified_at` = ? WHERE `id` = ?", rawCreatedAt, rawModifiedAt, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
