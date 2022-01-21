package dax

import (
	"database/sql"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func deleteTopCmtChild1(queryable mingru.Queryable, id uint64) (PostTableDeleteCmtChild1Result, error) {
	var result PostTableDeleteCmtChild1Result
	err := queryable.QueryRow("SELECT `post_cmt`.`host_id`, `join_1`.`reply_count` AS `reply_count` FROM `post_cmt` AS `post_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `post_cmt`.`cmt_id` WHERE `post_cmt`.`cmt_id` = ?", id).Scan(&result.HostID, &result.ReplyCount)
	if err != nil {
		return result, err
	}
	return result, nil
}

func deleteTopCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE (`id` = ? AND `user_id` = ?)", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func deleteTopCmtChild3(queryable mingru.Queryable, hostID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `post` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ?", replyCount, hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func deleteTopCmt(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		hostIDAndReplyCount, err := da.deleteCmtChild1(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteTopCmtChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteTopCmtChild3(tx, hostIDAndReplyCount.HostID, hostIDAndReplyCount.ReplyCount)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

func deleteReplyChild1(queryable mingru.Queryable, id uint64) (PostTableDeleteReplyChild1Result, error) {
	var result PostTableDeleteReplyChild1Result
	err := queryable.QueryRow("SELECT `reply`.`parent_id`, `join_2`.`host_id` AS `parent_host_id` FROM `reply` AS `reply` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `reply`.`parent_id` INNER JOIN `post_cmt` AS `join_2` ON `join_2`.`cmt_id` = `join_1`.`id` WHERE `reply`.`id` = ?", id).Scan(&result.ParentID, &result.ParentHostID)
	if err != nil {
		return result, err
	}
	return result, nil
}

func deleteReplyChild3(queryable mingru.Queryable, hostID uint64) error {
	result, err := queryable.Exec("UPDATE `post` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ?", hostID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func deleteReplyChild4(queryable mingru.Queryable, id uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, -1)
}

// DeleteReply ...
func (da *TableTypePost) deleteReply(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtIDAndHostID, err := da.deleteReplyChild1(tx, id)
		if err != nil {
			return err
		}
		err = Reply.DeleteReplyCore(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild3(tx, cmtIDAndHostID.ParentHostID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild4(tx, cmtIDAndHostID.ParentID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

func DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		preData, err := da.Cmt.SelectCmtDataForDeletion(db, id)
		if preData.ParentID == nil {
			// Deleting a cmt.

		} else {
			// Deleting a reply.
		}
		return err
	})
	return txErr
}
