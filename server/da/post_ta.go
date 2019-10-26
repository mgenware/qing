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

// DeletePost ...
func (da *TableTypePost) DeletePost(queryable dbx.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `post` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// EditPost ...
func (da *TableTypePost) EditPost(queryable dbx.Queryable, id uint64, userID uint64, title string, content string) error {
	result, err := queryable.Exec("UPDATE `post` SET `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?", title, content, id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypePost) insertCmtChild1(queryable dbx.Queryable, content string, userID uint64, createdAt time.Time, modifiedAt time.Time, rplCount uint) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `rpl_count`) VALUES (?, ?, ?, ?, ?)", content, userID, createdAt, modifiedAt, rplCount)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypePost) insertCmtChild2(queryable dbx.Queryable, postID uint64, cmtID uint64) error {
	_, err := queryable.Exec("INSERT INTO `post_cmt` (`post_id`, `cmt_id`) VALUES (?, ?)", postID, cmtID)
	return err
}

// InsertCmt ...
func (da *TableTypePost) InsertCmt(db *sql.DB, content string, userID uint64, createdAt time.Time, modifiedAt time.Time, rplCount uint, postID uint64, cmtID uint64) (uint64, error) {
	var insertedID uint64
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err = da.insertCmtChild1(tx, content, userID, createdAt, modifiedAt, rplCount)
		if err != nil {
			return err
		}
		err = da.insertCmtChild2(tx, postID, cmtID)
		if err != nil {
			return err
		}
		return nil
	})
	return insertedID, txErr
}

func (da *TableTypePost) insertPostChild1(queryable dbx.Queryable, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `post` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `likes`, `cmt_count`) VALUES (?, ?, ?, NOW(), NOW(), 0, 0)", title, content, userID)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypePost) insertPostChild2(queryable dbx.Queryable, userID uint64) error {
	return User.UpdatePostCount(queryable, userID, 1)
}

// InsertPost ...
func (da *TableTypePost) InsertPost(db *sql.DB, title string, content string, userID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var insertedID uint64
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err = da.insertPostChild1(tx, title, content, userID)
		if err != nil {
			return err
		}
		err = da.insertPostChild2(tx, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return insertedID, txErr
}

// PostCmtTableSelectCmtsResult ...
type PostCmtTableSelectCmtsResult struct {
	Content     string    `json:"content"`
	CreatedAt   time.Time `json:"createdAt"`
	ModifiedAt  time.Time `json:"modifiedAt"`
	RplCount    uint      `json:"rplCount"`
	UserID      uint64    `json:"userID"`
	CmtUserName string    `json:"cmtUserName"`
}

// SelectCmts ...
func (da *TableTypePost) SelectCmts(queryable dbx.Queryable, postID uint64) (*PostCmtTableSelectCmtsResult, error) {
	result := &PostCmtTableSelectCmtsResult{}
	err := queryable.QueryRow("SELECT `join_1`.`content` AS `content`, `join_1`.`created_at` AS `createdAt`, `join_1`.`modified_at` AS `modifiedAt`, `join_1`.`rpl_count` AS `rplCount`, `join_1`.`user_id` AS `userID`, `join_2`.`name` AS `cmtUserName` FROM `post_cmt` AS `post_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `post_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `post_cmt`.`post_id` = ?", postID).Scan(&result.Content, &result.CreatedAt, &result.ModifiedAt, &result.RplCount, &result.UserID, &result.CmtUserName)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// PostTableSelectPostByIDResult ...
type PostTableSelectPostByIDResult struct {
	ID           uint64    `json:"id"`
	Title        string    `json:"title"`
	CreatedAt    time.Time `json:"createdAt"`
	ModifiedAt   time.Time `json:"modifiedAt"`
	CmtCount     uint      `json:"cmtCount"`
	Content      string    `json:"content"`
	UserID       uint64    `json:"userID"`
	UserName     string    `json:"userName"`
	UserIconName string    `json:"userIconName"`
}

// SelectPostByID ...
func (da *TableTypePost) SelectPostByID(queryable dbx.Queryable, id uint64) (*PostTableSelectPostByIDResult, error) {
	result := &PostTableSelectPostByIDResult{}
	err := queryable.QueryRow("SELECT `post`.`id` AS `id`, `post`.`title` AS `title`, `post`.`created_at` AS `createdAt`, `post`.`modified_at` AS `modifiedAt`, `post`.`cmt_count` AS `cmtCount`, `post`.`content` AS `content`, `post`.`user_id` AS `userID`, `join_1`.`name` AS `userName`, `join_1`.`icon_name` AS `userIconName` FROM `post` AS `post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `post`.`user_id` WHERE `post`.`id` = ?", id).Scan(&result.ID, &result.Title, &result.CreatedAt, &result.ModifiedAt, &result.CmtCount, &result.Content, &result.UserID, &result.UserName, &result.UserIconName)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// PostTableSelectPostForEditingResult ...
type PostTableSelectPostForEditingResult struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// SelectPostForEditing ...
func (da *TableTypePost) SelectPostForEditing(queryable dbx.Queryable, id uint64, userID uint64) (*PostTableSelectPostForEditingResult, error) {
	result := &PostTableSelectPostForEditingResult{}
	err := queryable.QueryRow("SELECT `title`, `content` FROM `post` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Title, &result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// PostTableSelectPostsByUserResult ...
type PostTableSelectPostsByUserResult struct {
	ID         uint64    `json:"id"`
	Title      string    `json:"title"`
	CreatedAt  time.Time `json:"createdAt"`
	ModifiedAt time.Time `json:"modifiedAt"`
	CmtCount   uint      `json:"cmtCount"`
}

// SelectPostsByUser ...
func (da *TableTypePost) SelectPostsByUser(queryable dbx.Queryable, userID uint64, page int, pageSize int) ([]*PostTableSelectPostsByUserResult, bool, error) {
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `id`, `title`, `created_at`, `modified_at`, `cmt_count` FROM `post` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
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
