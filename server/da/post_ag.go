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

func (mrTable *PostAGType) BrDeleteByPattern(mrQueryable mingru.Queryable, pattern string) (int, error) {
	result, err := mrQueryable.Exec("DELETE FROM `post` WHERE `title` LIKE ?", pattern)
	return mingru.GetRowsAffectedIntWithError(result, err)
}

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

func (mrTable *PostAGType) EditItem(mrQueryable mingru.Queryable, id uint64, userID uint64, contentHTML string, contentSrc *string, title string, summary string, sanitizedStub int) error {
	result, err := mrQueryable.Exec("UPDATE `post` SET `modified_at` = NOW(3), `content` = ?, `content_src` = ?, `title` = ?, `summary` = ? WHERE (`id` = ? AND `user_id` = ?)", contentHTML, contentSrc, title, summary, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *PostAGType) insertItemChild1(mrQueryable mingru.Queryable, userID uint64, contentHTML string, contentSrc *string, title string, summary string) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `post` (`created_at`, `cmt_count`, `likes`, `last_replied_at`, `user_id`, `content`, `content_src`, `title`, `summary`, `modified_at`) VALUES (NOW(3), 0, 0, NULL, ?, ?, ?, ?, ?, `created_at`)", userID, contentHTML, contentSrc, title, summary)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *PostAGType) insertItemChild2(mrQueryable mingru.Queryable, id uint64) error {
	return UserStats.UpdatePostCount(mrQueryable, id, 1)
}

func (mrTable *PostAGType) InsertItem(db *sql.DB, userID uint64, contentHTML string, contentSrc *string, title string, summary string, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := mrTable.insertItemChild1(tx, userID, contentHTML, contentSrc, title, summary)
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

func (mrTable *PostAGType) RefreshLastRepliedAt(mrQueryable mingru.Queryable, id uint64) error {
	result, err := mrQueryable.Exec("UPDATE `post` SET `last_replied_at` = NOW() WHERE `id` = ?", id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *PostAGType) SelectItemByID(mrQueryable mingru.Queryable, id uint64) (DBPost, error) {
	var result DBPost
	err := mrQueryable.QueryRow("SELECT `post`.`id`, `post`.`user_id`, `join_1`.`name`, `join_1`.`icon_name`, `post`.`created_at`, `post`.`modified_at`, `post`.`content`, `post`.`likes`, `post`.`cmt_count`, `post`.`title` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` WHERE `post`.`id` = ?", id).Scan(&result.ID, &result.UserID, &result.UserName, &result.UserIconName, &result.RawCreatedAt, &result.RawModifiedAt, &result.ContentHTML, &result.Likes, &result.CmtCount, &result.Title)
	if err != nil {
		return result, err
	}
	return result, nil
}

type PostAGSelectItemsForPostCenterOrderBy1 int

const (
	PostAGSelectItemsForPostCenterOrderBy1CreatedAt PostAGSelectItemsForPostCenterOrderBy1 = iota
	PostAGSelectItemsForPostCenterOrderBy1Likes
	PostAGSelectItemsForPostCenterOrderBy1CmtCount
)

func (mrTable *PostAGType) SelectItemsForPostCenter(mrQueryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 PostAGSelectItemsForPostCenterOrderBy1, orderBy1Desc bool) ([]DBPostForPostCenter, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case PostAGSelectItemsForPostCenterOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case PostAGSelectItemsForPostCenterOrderBy1Likes:
		orderBy1SQL = "`likes`"
	case PostAGSelectItemsForPostCenterOrderBy1CmtCount:
		orderBy1SQL = "`cmt_count`"
	default:
		err := fmt.Errorf("unsupported value %v", orderBy1)
		return nil, false, err
	}
	if orderBy1Desc {
		orderBy1SQL += " DESC"
	}

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
	rows, err := mrQueryable.Query("SELECT `id`, `created_at`, `modified_at`, `likes`, `title`, `cmt_count` FROM `post` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]DBPostForPostCenter, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item DBPostForPostCenter
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

func (mrTable *PostAGType) SelectItemsForUserProfile(mrQueryable mingru.Queryable, userID uint64, page int, pageSize int) ([]DBPostForProfile, bool, error) {
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
	rows, err := mrQueryable.Query("SELECT `id`, `created_at`, `modified_at`, `title`, `cmt_count` FROM `post` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]DBPostForProfile, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			var item DBPostForProfile
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

func (mrTable *PostAGType) SelectItemSrc(mrQueryable mingru.Queryable, id uint64, userID uint64) (DBEntitySrc, error) {
	var result DBEntitySrc
	err := mrQueryable.QueryRow("SELECT `content`, `content_src`, `title` FROM `post` WHERE (`id` = ? AND `user_id` = ?)", id, userID).Scan(&result.ContentHTML, &result.ContentSrc, &result.Title)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *PostAGType) SelectTitle(mrQueryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := mrQueryable.QueryRow("SELECT `title` FROM `post` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *PostAGType) TestUpdateDates(mrQueryable mingru.Queryable, id uint64, rawCreatedAt time.Time, rawModifiedAt time.Time) error {
	result, err := mrQueryable.Exec("UPDATE `post` SET `created_at` = ?, `modified_at` = ? WHERE `id` = ?", rawCreatedAt, rawModifiedAt, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
