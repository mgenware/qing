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

// InsertCore ...
func (da *TableTypePost) InsertCore(queryable dbx.Queryable, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `post` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `likes`, `cmt_count`) VALUES (?, ?, ?, NOW(), NOW(), 0, 0)", title, content, userID)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

// InsertPost ...
func (da *TableTypePost) InsertPost(db *sql.DB, title string, content string, userID uint64) (uint64, error) {
	var insertedID uint64
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err = da.InsertCore(tx, title, content, userID)
		if err != nil {
			return err
		}
		err = User.UpdatePostCount(tx, userID, 1)
		if err != nil {
			return err
		}
		return nil
	})
	return insertedID, txErr
}

// PostTableSelectPostsByUserResult ...
type PostTableSelectPostsByUserResult struct {
	ID         uint64
	Title      string
	Content    string
	CreatedAt  time.Time
	ModifiedAt time.Time
}

// SelectPostsByUser ...
func (da *TableTypePost) SelectPostsByUser(queryable dbx.Queryable, userID uint64, page int, pageSize int) ([]*PostTableSelectPostsByUserResult, bool, error) {
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `id`, `title`, `content`, `created_at`, `modified_at` FROM `post` WHERE ? LIMIT ? OFFSET ?", userID, limit, offset)
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
			err = rows.Scan(&item.ID, &item.Title, &item.Content, &item.CreatedAt, &item.ModifiedAt)
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
