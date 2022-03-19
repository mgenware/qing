package dax

import (
	"database/sql"
	"qing/a/def/appdef"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func DeleteCmt(db *sql.DB, id uint64, userID uint64, hostTable mingru.Table, hostID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		preData, err := da.Cmt.MemLockedGetCmtDataForDeletion(db, id)
		if err != nil {
			return err
		}

		if preData.ReplyCount != 0 {
			// This cmt contains replies, erase it.
			err = da.Cmt.EraseCmt(db, id, userID, uint8(appdef.DeleteFlagAuthor))
		} else {
			// Delete the cmt.
			err = da.Cmt.DeleteCore(db, id, userID)
		}

		if preData.ParentID == nil {
			// Deleting a root cmt.
			// hostPost.cmt_count--
			err = da.ContentBaseUtil.UpdateCmtCount(db, hostTable, hostID, -1)
		} else {
			// Deleting a reply.
			// parentCmt.reply_count--
		}
		return err
	})
	return txErr
}
