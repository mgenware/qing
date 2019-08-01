 /******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"database/sql"
	"time"

	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypePost ...
type TableTypePost struct {
}

// Post ...
var Post = &TableTypePost{}

// ------------ Actions ------------

func (da *TableTypePost) insertPostChild0(queryable dbx.Queryable, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `post` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `likes`, `cmt_count`) VALUES (?, ?, ?, NOW(), NOW(), 0, 0)", title, content, userID)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypePost) insertPostChild1(queryable dbx.Queryable, userID uint64) error {
	return User.UpdatePostCount(queryable, userID, 1)
}

// InsertPost ...
func (da *TableTypePost) InsertPost(db *sql.DB, title string, content string, userID uint64) (uint64, error) {
	var insertedID uint64
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err = da.insertPostChild0(tx, title, content, userID)
		if err != nil {
			return err
		}
		err = da.insertPostChild1(tx, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return insertedID, txErr
}

// PostTableSelectPostByIDResult ...
type PostTableSelectPostByIDResult struct {
	ID         uint64
	Title      string
	CreatedAt  time.Time
	ModifiedAt time.Time
	CmtCount   uint
	Content    string
	UserID     uint64
}

// SelectPostByID ...
func (da *TableTypePost) SelectPostByID(queryable dbx.Queryable, id uint64) (*PostTableSelectPostByIDResult, error) {
	result := &PostTableSelectPostByIDResult{}
	err := queryable.QueryRow("SELECT `id`, `title`, `created_at`, `modified_at`, `cmt_count`, `content`, `user_id` FROM `post` WHERE `id` = ?", id).Scan(&result.ID, &result.Title, &result.CreatedAt, &result.ModifiedAt, &result.CmtCount, &result.Content, &result.UserID)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// PostTableSelectPostsByUserResult ...
type PostTableSelectPostsByUserResult struct {
	ID         uint64
	Title      string
	CreatedAt  time.Time
	ModifiedAt time.Time
	CmtCount   uint
}

// SelectPostsByUser ...
func (da *TableTypePost) SelectPostsByUser(queryable dbx.Queryable, userID uint64, page int, pageSize int) ([]*PostTableSelectPostsByUserResult, bool, error) {
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `id`, `title`, `created_at`, `modified_at`, `cmt_count` FROM `post` WHERE ? LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*PostTableSelectPostsByUserResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &PostTableSelectPostsByUserResult{}
			err = rows.Scan(&item.ID, &item.Title, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount)
			if err != nil {
				return nil, false, err
			}
			result = append(result, item)
		}
	}
	err = rows.Err()
	if err != nil {
		return nil, false, err
	}
	return result, itemCounter > len(result), nil
}
