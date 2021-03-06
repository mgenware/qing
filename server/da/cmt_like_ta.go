/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

 /******************************************************************************************
  * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/

package da

import (
	"database/sql"

	"github.com/mgenware/mingru-go-lib"
)

// TableTypeCmtLike ...
type TableTypeCmtLike struct {
}

// CmtLike ...
var CmtLike = &TableTypeCmtLike{}

// ------------ Actions ------------

func (da *TableTypeCmtLike) cancelLikeChild1(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt_like` WHERE (`host_id` = ? AND `user_id` = ?)", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeCmtLike) cancelLikeChild2(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `cmt` SET `likes` = `likes` + -1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// CancelLike ...
func (da *TableTypeCmtLike) CancelLike(db *sql.DB, hostID uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		err = da.cancelLikeChild1(tx, hostID, userID)
		if err != nil {
			return err
		}
		err = da.cancelLikeChild2(tx, hostID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// HasLiked ...
func (da *TableTypeCmtLike) HasLiked(queryable mingru.Queryable, hostID uint64, userID uint64) (bool, error) {
	var result bool
	err := queryable.QueryRow("SELECT EXISTS(SELECT * FROM `cmt_like` WHERE (`host_id` = ? AND `user_id` = ?))", hostID, userID).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeCmtLike) likeChild1(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	_, err := queryable.Exec("INSERT INTO `cmt_like` (`host_id`, `user_id`) VALUES (?, ?)", hostID, userID)
	return err
}

func (da *TableTypeCmtLike) likeChild2(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `cmt` SET `likes` = `likes` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// Like ...
func (da *TableTypeCmtLike) Like(db *sql.DB, hostID uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		err = da.likeChild1(tx, hostID, userID)
		if err != nil {
			return err
		}
		err = da.likeChild2(tx, hostID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}
