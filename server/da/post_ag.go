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

type PostAGType struct {
}

var Post = &PostAGType{}

// ------------ Actions ------------

func (mrTable *PostAGType) deleteItemChild1(mrQueryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `post` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *PostAGType) deleteItemChild2(mrQueryable mingru.Queryable, id uint64) error {
	return UserStats.UpdatePostCount(mrQueryable, id, -1)
}

func (mrTable *PostAGType) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
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

func (mrTable *PostAGType) EditItem(mrQueryable mingru.Queryable, id uint64, userID uint64, rawModifiedAt time.Time, contentHTML string, title string, sanitizedStub int) error {
	result, err := mrQueryable.Exec("UPDATE `post` SET `modified_at` = ?, `content` = ?, `title` = ? WHERE (`id` = ? AND `user_id` = ?)", rawModifiedAt, contentHTML, title, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *PostAGType) insertItemChild1(mrQueryable mingru.Queryable, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time, contentHTML string, title string) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `post` (`user_id`, `created_at`, `modified_at`, `content`, `title`, `cmt_count`, `likes`) VALUES (?, ?, ?, ?, ?, 0, 0)", userID, rawCreatedAt, rawModifiedAt, contentHTML, title)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *PostAGType) insertItemChild2(mrQueryable mingru.Queryable, id uint64) error {
	return UserStats.UpdatePostCount(mrQueryable, id, 1)
}

func (mrTable *PostAGType) InsertItem(db *sql.DB, userID uint64, rawCreatedAt time.Time, rawModifiedAt time.Time, contentHTML string, title string, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := mrTable.insertItemChild1(tx, userID, rawCreatedAt, rawModifiedAt, contentHTML, title)
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

func (mrTable *PostAGType) SelectItemByID(mrQueryable mingru.Queryable, id uint64) (PostTableSelectItemByIDResult, error) {
	var result PostTableSelectItemByIDResult
	err := mrQueryable.QueryRow("SELECT `post`.`id`, `post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `post`.`created_at`, `post`.`modified_at`, `post`.`content`, `post`.`likes`, `post`.`cmt_count`, `post`.`title` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` WHERE `post`.`id` = ?", id).Scan(&result.ID, &result.UserID, &result.UserName, &result.UserIconName, &result.RawCreatedAt, &result.RawModifiedAt, &result.ContentHTML, &result.Likes, &result.CmtCount, &result.Title)
	if err != nil {
		return result, err
	}
	return result, nil
}

const (
	PostTableSelectItemsForPostCenterOrderBy1CreatedAt = iota
	PostTableSelectItemsForPostCenterOrderBy1Likes
	PostTableSelectItemsForPostCenterOrderBy1CmtCount
)

type PostTableSelectItemsForPostCenterResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

func (mrTable *PostAGType) SelectItemsForPostCenter(mrQueryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]PostTableSelectItemsForPostCenterResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `id`, `created_at`, `modified_at`, `likes`, `title`, `cmt_count` FROM `post` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
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
			err = rows.Scan(&item.ID, &item.RawCreatedAt, &item.RawModifiedAt, &item.Likes, &item.Title, &item.CmtCount)
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

type PostTableSelectItemsForUserProfileResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

func (mrTable *PostAGType) SelectItemsForUserProfile(mrQueryable mingru.Queryable, userID uint64, page int, pageSize int) ([]PostTableSelectItemsForUserProfileResult, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `id`, `created_at`, `modified_at`, `title`, `cmt_count` FROM `post` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
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
			err = rows.Scan(&item.ID, &item.RawCreatedAt, &item.RawModifiedAt, &item.Title, &item.CmtCount)
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

func (mrTable *PostAGType) SelectItemSrc(mrQueryable mingru.Queryable, id uint64, userID uint64) (EntityGetSrcResult, error) {
	var result EntityGetSrcResult
	err := mrQueryable.QueryRow("SELECT `content`, `title` FROM `post` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.ContentHTML, &result.Title)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *PostAGType) TestUpdateDates(mrQueryable mingru.Queryable, id uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) error {
	result, err := mrQueryable.Exec("UPDATE `post` SET `created_at` = ?, `modified_at` = ? WHERE `id` = ?", rawCreatedAt, rawModifiedAt, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
