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
	ReplyCount   uint       `json:"replyCount,omitempty"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"userName,omitempty"`
	UserIconName string     `json:"-"`
}

// ReplyData ...
type ReplyData struct {
	ID           uint64     `json:"-"`
	Content      string     `json:"content,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	UserID       uint64     `json:"-"`
	ToUserID     uint64     `json:"-"`
	UserName     string     `json:"userName,omitempty"`
	UserIconName string     `json:"-"`
}

// ------------ Interfaces ------------

// CmtInterface ...
type CmtInterface interface {
	DeleteCmt(db *sql.DB, id uint64, userID uint64, hostID uint64) error
	InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error)
	InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error)
	SelectCmts(queryable dbx.Queryable, hostID uint64, page int, pageSize int) ([]*CmtData, bool, error)
}

// ReplyInterface ...
type ReplyInterface interface {
	SelectReplies(queryable dbx.Queryable, parentID uint64, page int, pageSize int) ([]*ReplyData, bool, error)
}
