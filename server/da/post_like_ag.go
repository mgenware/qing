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

	"github.com/mgenware/mingru-go-lib"
)

type post_likeAGType struct {
}

var post_like = &post_likeAGType{}

// ------------ Actions ------------

func (mrTable *post_likeAGType) cancelLikeChild1(mrQueryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := mrQueryable.Exec("DELETE FROM `post_like` WHERE (`host_id` = ? AND `user_id` = ?)", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *post_likeAGType) cancelLikeChild2(mrQueryable mingru.Queryable, hostID uint64) error {
	result, err := mrQueryable.Exec("UPDATE `post` SET `likes` = `likes` + -1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *post_likeAGType) CancelLike(db *sql.DB, hostID uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		err = mrTable.cancelLikeChild1(tx, hostID, userID)
		if err != nil {
			return err
		}
		err = mrTable.cancelLikeChild2(tx, hostID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

func (mrTable *post_likeAGType) HasLiked(mrQueryable mingru.Queryable, hostID uint64, userID uint64) (bool, error) {
	var result bool
	err := mrQueryable.QueryRow("SELECT EXISTS(SELECT * FROM `post_like` WHERE (`host_id` = ? AND `user_id` = ?))", hostID, userID).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *post_likeAGType) likeChild1(mrQueryable mingru.Queryable, hostID uint64, userID uint64) error {
	_, err := mrQueryable.Exec("INSERT INTO `post_like` (`host_id`, `user_id`) VALUES (?, ?)", hostID, userID)
	return err
}

func (mrTable *post_likeAGType) likeChild2(mrQueryable mingru.Queryable, hostID uint64) error {
	result, err := mrQueryable.Exec("UPDATE `post` SET `likes` = `likes` + 1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *post_likeAGType) Like(db *sql.DB, hostID uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		err = mrTable.likeChild1(tx, hostID, userID)
		if err != nil {
			return err
		}
		err = mrTable.likeChild2(tx, hostID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}
