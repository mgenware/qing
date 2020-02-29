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

func (da *TableTypePost) deleteCmtChild2(queryable dbx.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypePost) deleteCmtChild3(queryable dbx.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `post` SET `cmt_count` = `cmt_count` + ? WHERE `id` = ? AND `user_id` = ?", -1, hostID, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypePost) DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		hostID, err := Cmt.GetHostID(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteCmtChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteCmtChild3(tx, hostID, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// DeletePost ...
func (da *TableTypePost) DeletePost(queryable dbx.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `post` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// EditPost ...
func (da *TableTypePost) EditPost(queryable dbx.Queryable, id uint64, userID uint64, title string, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `post` SET `modified_at` = UTC_TIMESTAMP(), `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?", title, content, id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypePost) insertCmtChild1(queryable dbx.Queryable, content string, userID uint64, hostID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `host_id`, `rpl_count`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, 0)", content, userID, hostID)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypePost) insertCmtChild2(queryable dbx.Queryable, hostID uint64, cmtID uint64) error {
	_, err := queryable.Exec("INSERT INTO `post_cmt` (`host_id`, `cmt_id`) VALUES (?, ?)", hostID, cmtID)
	return err
}

func (da *TableTypePost) insertCmtChild3(queryable dbx.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `post` SET `cmt_count` = `cmt_count` + ? WHERE `id` = ? AND `user_id` = ?", 1, hostID, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypePost) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var cmtIDExported uint64
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtID, err := da.insertCmtChild1(tx, content, userID, hostID)
		if err != nil {
			return err
		}
		err = da.insertCmtChild2(tx, hostID, cmtID)
		if err != nil {
			return err
		}
		err = da.insertCmtChild3(tx, hostID, userID)
		if err != nil {
			return err
		}
		cmtIDExported = cmtID
		return nil
	})
	return cmtIDExported, txErr
}

func (da *TableTypePost) insertPostChild1(queryable dbx.Queryable, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `post` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `cmt_count`, `likes`) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0)", title, content, userID)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypePost) insertPostChild2(queryable dbx.Queryable, userID uint64) error {
	return User.UpdatePostCount(queryable, userID, 1)
}

// InsertPost ...
func (da *TableTypePost) InsertPost(db *sql.DB, title string, content string, userID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var postIDExported uint64
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		postID, err := da.insertPostChild1(tx, title, content, userID)
		if err != nil {
			return err
		}
		err = da.insertPostChild2(tx, userID)
		if err != nil {
			return err
		}
		postIDExported = postID
		return nil
	})
	return postIDExported, txErr
}

func (da *TableTypePost) insertReplyChild1(queryable dbx.Queryable, content string, userID uint64, toUserID uint64, parentID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `reply` (`content`, `user_id`, `created_at`, `modified_at`, `to_user_id`, `parent_id`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, ?)", content, userID, toUserID, parentID)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypePost) insertReplyChild2(queryable dbx.Queryable, replyID uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, replyID, userID, 1)
}

func (da *TableTypePost) insertReplyChild3(queryable dbx.Queryable, replyID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `post` SET `cmt_count` = `cmt_count` + ? WHERE `id` = ? AND `user_id` = ?", 1, replyID, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypePost) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := da.insertReplyChild1(tx, content, userID, toUserID, parentID)
		if err != nil {
			return err
		}
		err = da.insertReplyChild2(tx, replyID, userID)
		if err != nil {
			return err
		}
		err = da.insertReplyChild3(tx, replyID, userID)
		if err != nil {
			return err
		}
		replyIDExported = replyID
		return nil
	})
	return replyIDExported, txErr
}

// SelectCmts ...
func (da *TableTypePost) SelectCmts(queryable dbx.Queryable, hostID uint64, page int, pageSize int) ([]*CmtData, bool, error) {
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `post_cmt`.`cmt_id` AS `cmtID`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `createdAt`, `join_1`.`modified_at` AS `modifiedAt`, `join_1`.`rpl_count` AS `rplCount`, `join_1`.`user_id` AS `userID`, `join_2`.`name` AS `userName`, `join_2`.`icon_name` AS `userIconName` FROM `post_cmt` AS `post_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `post_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `post_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*CmtData, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &CmtData{}
			err = rows.Scan(&item.CmtID, &item.Content, &item.CreatedAt, &item.ModifiedAt, &item.RplCount, &item.UserID, &item.UserName, &item.UserIconName)
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

// PostTableSelectPostByIDResult ...
type PostTableSelectPostByIDResult struct {
	ID           uint64     `json:"id,omitempty"`
	Title        string     `json:"title,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	CmtCount     uint       `json:"cmtCount,omitempty"`
	Content      string     `json:"content,omitempty"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"-"`
	UserIconName string     `json:"-"`
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

// PostTableSelectPostSourceResult ...
type PostTableSelectPostSourceResult struct {
	Title   string `json:"title,omitempty"`
	Content string `json:"content,omitempty"`
}

// SelectPostSource ...
func (da *TableTypePost) SelectPostSource(queryable dbx.Queryable, id uint64, userID uint64) (*PostTableSelectPostSourceResult, error) {
	result := &PostTableSelectPostSourceResult{}
	err := queryable.QueryRow("SELECT `title`, `content` FROM `post` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Title, &result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// PostTableSelectPostsByUserResult ...
type PostTableSelectPostsByUserResult struct {
	ID         uint64     `json:"id,omitempty"`
	Title      string     `json:"title,omitempty"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	CmtCount   uint       `json:"cmtCount,omitempty"`
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
