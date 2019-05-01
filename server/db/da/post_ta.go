 /******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"time"

	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypePost ...
type TableTypePost struct {
}

// Post ...
var Post = &TableTypePost{}

// ------------ Actions ------------

// PostTableSelectPostsByUserResult ...
type PostTableSelectPostsByUserResult struct {
	ID         uint64
	Title      string
	Content    string
	CreatedAt  time.Time
	ModifiedAt time.Time
}

// SelectPostsByUser ...
func (da *TableTypePost) SelectPostsByUser(queryable dbx.Queryable, userID uint64, limit, offset int) ([]*PostTableSelectPostsByUserResult, error) {
	rows, err := queryable.Query("SELECT `id`, `title`, `content`, `created_at`, `modified_at` FROM `post` WHERE `user_id` = ? LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, err
	}
	result := make([]*PostTableSelectPostsByUserResult, 0, limit)
	defer rows.Close()
	for rows.Next() {
		item := &PostTableSelectPostsByUserResult{}
		err = rows.Scan(&item.ID, &item.Title, &item.Content, &item.CreatedAt, &item.ModifiedAt)
		if err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return result, nil
}

// InsertPost ...
func (da *TableTypePost) InsertPost(queryable dbx.Queryable, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `post` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `likes`, `cmt_count`) VALUES (?, ?, ?, NOW(), NOW(), 0, 0)", title, content, userID)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}
