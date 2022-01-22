package dax

import (
	"database/sql"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		preData, err := da.Cmt.MemLockedGetCmtDataForDeletion(db, id)
		if preData.ParentID == nil {
			// Deleting a cmt.
		} else {
			// Deleting a reply.
		}
		return err
	})
	return txErr
}
