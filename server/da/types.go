package da

import (
	"database/sql"
	"time"

	"github.com/mgenware/mingru-go-lib"
)

// ------------ Result types ------------

// CmtData ...
type CmtData struct {
	CmtID        uint64     `json:"-"`
	ContentHTML  string     `json:"contentHTML,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	ReplyCount   uint       `json:"replyCount,omitempty"`
	UserIconName string     `json:"-"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"userName,omitempty"`
}

// FindUserResult ...
type FindUserResult struct {
	IconName string `json:"-"`
	ID       uint64 `json:"-"`
	Name     string `json:"name,omitempty"`
	Status   string `json:"status,omitempty"`
}

// ReplyData ...
type ReplyData struct {
	ContentHTML  string     `json:"contentHTML,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ID           uint64     `json:"-"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	ToUserID     uint64     `json:"-"`
	ToUserName   string     `json:"toUserName,omitempty"`
	UserIconName string     `json:"-"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"userName,omitempty"`
}

// UserThreadInterface ...
type UserThreadInterface struct {
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ID           uint64     `json:"-"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	ThreadType   int        `json:"threadType,omitempty"`
	Title        string     `json:"title,omitempty"`
	UserIconName string     `json:"-"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"-"`
	Value1       uint       `json:"value1,omitempty"`
	Value2       uint       `json:"value2,omitempty"`
	Value3       uint       `json:"value3,omitempty"`
}

// ------------ Interfaces ------------

// CmtInterface ...
type CmtInterface interface {
	DeleteCmt(db *sql.DB, id uint64, userID uint64) error
	DeleteReply(db *sql.DB, id uint64, userID uint64) error
	InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error)
	InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error)
	SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]*CmtData, bool, error)
}

// LikeInterface ...
type LikeInterface interface {
	CancelLike(db *sql.DB, hostID uint64, userID uint64) error
	HasLiked(queryable mingru.Queryable, hostID uint64, userID uint64) (bool, error)
	Like(db *sql.DB, hostID uint64, userID uint64) error
}

// ReplyInterface ...
type ReplyInterface interface {
	SelectReplies(queryable mingru.Queryable, parentID uint64, page int, pageSize int) ([]*ReplyData, bool, error)
}
