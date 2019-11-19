package da

import (
	"database/sql"
	"time"

	"github.com/mgenware/go-packagex/v5/dbx"
)

// ------------ Result types ------------

// SelectCmtResult ...
type SelectCmtResult struct {
	Content      string    `json:"content"`
	CreatedAt    time.Time `json:"createdAt"`
	ModifiedAt   time.Time `json:"modifiedAt"`
	RplCount     uint      `json:"rplCount"`
	UserID       uint64    `json:"-"`
	UserName     string    `json:"userName"`
	UserIconName string    `json:"-"`
}

// ------------ Interfaces ------------

// CmtCore ...
type CmtCore interface {
	InsertCmt(db *sql.DB, content string, userID uint64, createdAt time.Time, modifiedAt time.Time, rplCount uint, postID uint64, cmtID uint64) (uint64, error)
	SelectCmts(queryable dbx.Queryable, postID uint64, page int, pageSize int) ([]*SelectCmtResult, bool, error)
}
