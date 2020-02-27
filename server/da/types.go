package da

import (
	"database/sql"
	"time"

	"github.com/mgenware/go-packagex/v5/dbx"
)

// ------------ Result types ------------

// CmtData ...
type CmtData struct {
	CmtID        uint64     `json:"-"`
	Content      string     `json:"content,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	RplCount     uint       `json:"rplCount,omitempty"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"userName,omitempty"`
	UserIconName string     `json:"-"`
}

// ------------ Interfaces ------------

// CmtCore ...
type CmtCore interface {
	DeleteCmt(db *sql.DB, id uint64, userID uint64) error
	InsertCmt(db *sql.DB, content string, userID uint64, postID uint64, sanitizedStub int, captStub int) (uint64, error)
	SelectCmts(queryable dbx.Queryable, postID uint64, page int, pageSize int) ([]*CmtData, bool, error)
}
