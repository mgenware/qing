package dax

import (
	"database/sql"
	"qing/a/def/appDef"
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

		cmtDeleted := false
		if preData.CmtCount != 0 {
			// This cmt contains replies, erase it.
			err = da.Cmt.EraseCmt(db, id, userID, uint8(appDef.DeleteFlagSelf))
		} else {
			// Delete the cmt.
			err = da.Cmt.DeleteCore(db, id, userID)
			cmtDeleted = true
		}
		if err != nil {
			return err
		}

		if cmtDeleted {
			if preData.ParentID != nil {
				// Deleting a reply.
				// parentCmt.reply_count--
				err = da.Cmt.UpdateReplyCount(db, *preData.ParentID, -1)
				if err != nil {
					return err
				}
			}
			// hostPost.cmt_count--
			err = da.ContentBaseStatic.UpdateCmtCount(db, hostTable, hostID, -1)
			if err != nil {
				return err
			}
		}

		return nil
	})
	return txErr
}
