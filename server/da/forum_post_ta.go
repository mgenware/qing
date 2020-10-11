/******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/mgenware/mingru-go-lib"
)

// TableTypeForumPost ...
type TableTypeForumPost struct {
}

// ForumPost ...
var ForumPost = &TableTypeForumPost{}

// ------------ Actions ------------

func (da *TableTypeForumPost) deleteCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeForumPost) deleteCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `forum_post` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ? AND `user_id` = ?", replyCount, hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypeForumPost) DeleteCmt(db *sql.DB, id uint64, userID uint64, hostID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		hostIDAndReplyCount, err := Cmt.GetHostIdAndReplyCount(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteCmtChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteCmtChild3(tx, hostID, userID, hostIDAndReplyCount.ReplyCount)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// DeletePosts ...
func (da *TableTypeForumPost) DeletePosts(queryable mingru.Queryable, ids []uint64, userID uint64) (int, error) {
	if len(ids) == 0 {
		return 0, fmt.Errorf("The array argument `ids` cannot be empty")
	}
	var queryParams []interface{}
	for _, item := range ids {
		queryParams = append(queryParams, item)
	}
	queryParams = append(queryParams, userID)
	result, err := queryable.Exec("DELETE FROM `forum_post` WHERE `id` IN ("+mingru.InputPlaceholders(len(ids))+") AND `user_id` = ?", queryParams...)
	return mingru.GetRowsAffectedIntWithError(result, err)
}

func (da *TableTypeForumPost) deleteReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `reply` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeForumPost) deleteReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `forum_post` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeForumPost) deleteReplyChild4(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, -1)
}

// DeleteReply ...
func (da *TableTypeForumPost) DeleteReply(db *sql.DB, id uint64, userID uint64, hostID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		parentID, err := Reply.GetParentID(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild3(tx, hostID, userID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild4(tx, parentID, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// EditPost ...
func (da *TableTypeForumPost) EditPost(queryable mingru.Queryable, id uint64, userID uint64, title string, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `forum_post` SET `modified_at` = UTC_TIMESTAMP(), `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?", title, content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeForumPost) insertCmtChild1(queryable mingru.Queryable, content string, userID uint64, hostID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `host_id`, `reply_count`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, 0)", content, userID, hostID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeForumPost) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `forum_post_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (da *TableTypeForumPost) insertCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `forum_post` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypeForumPost) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var cmtIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtID, err := da.insertCmtChild1(tx, content, userID, hostID)
		if err != nil {
			return err
		}
		err = da.insertCmtChild2(tx, cmtID, hostID)
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

func (da *TableTypeForumPost) insertPostChild1(queryable mingru.Queryable, title string, content string, userID uint64, forumID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `forum_post` (`title`, `content`, `user_id`, `forum_id`, `created_at`, `modified_at`, `cmt_count`, `votes`, `up_votes`, `down_votes`) VALUES (?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, 0)", title, content, userID, forumID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeForumPost) insertPostChild2(queryable mingru.Queryable, userID uint64) error {
	return User.UpdatePostCount(queryable, userID, 1)
}

// InsertPost ...
func (da *TableTypeForumPost) InsertPost(db *sql.DB, title string, content string, userID uint64, forumID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var postIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		postID, err := da.insertPostChild1(tx, title, content, userID, forumID)
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

func (da *TableTypeForumPost) insertReplyChild1(queryable mingru.Queryable, content string, userID uint64, toUserID uint64, parentID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `reply` (`content`, `user_id`, `created_at`, `modified_at`, `to_user_id`, `parent_id`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, ?)", content, userID, toUserID, parentID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeForumPost) insertReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, 1)
}

func (da *TableTypeForumPost) insertReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `forum_post` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypeForumPost) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := da.insertReplyChild1(tx, content, userID, toUserID, parentID)
		if err != nil {
			return err
		}
		err = da.insertReplyChild2(tx, parentID, userID)
		if err != nil {
			return err
		}
		err = da.insertReplyChild3(tx, hostID, userID)
		if err != nil {
			return err
		}
		replyIDExported = replyID
		return nil
	})
	return replyIDExported, txErr
}

// SelectCmts ...
func (da *TableTypeForumPost) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]*CmtData, bool, error) {
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `forum_post_cmt`.`cmt_id` AS `cmtID`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `createdAt`, `join_1`.`modified_at` AS `modifiedAt`, `join_1`.`reply_count` AS `replyCount`, `join_1`.`user_id` AS `userID`, `join_2`.`name` AS `userName`, `join_2`.`icon_name` AS `userIconName` FROM `forum_post_cmt` AS `forum_post_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `forum_post_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `forum_post_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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
			err = rows.Scan(&item.CmtID, &item.Content, &item.CreatedAt, &item.ModifiedAt, &item.ReplyCount, &item.UserID, &item.UserName, &item.UserIconName)
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

// ForumPostTableSelectPostByIDResult ...
type ForumPostTableSelectPostByIDResult struct {
	ID           uint64     `json:"-"`
	Title        string     `json:"title,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	CmtCount     uint       `json:"cmtCount,omitempty"`
	Votes        uint       `json:"votes,omitempty"`
	Content      string     `json:"content,omitempty"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"-"`
	UserIconName string     `json:"-"`
}

// SelectPostByID ...
func (da *TableTypeForumPost) SelectPostByID(queryable mingru.Queryable, id uint64) (*ForumPostTableSelectPostByIDResult, error) {
	result := &ForumPostTableSelectPostByIDResult{}
	err := queryable.QueryRow("SELECT `forum_post`.`id` AS `id`, `forum_post`.`title` AS `title`, `forum_post`.`created_at` AS `createdAt`, `forum_post`.`modified_at` AS `modifiedAt`, `forum_post`.`cmt_count` AS `cmtCount`, `forum_post`.`votes` AS `votes`, `forum_post`.`content` AS `content`, `forum_post`.`user_id` AS `userID`, `join_1`.`name` AS `userName`, `join_1`.`icon_name` AS `userIconName` FROM `forum_post` AS `forum_post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `forum_post`.`user_id` WHERE `forum_post`.`id` = ?", id).Scan(&result.ID, &result.Title, &result.CreatedAt, &result.ModifiedAt, &result.CmtCount, &result.Votes, &result.Content, &result.UserID, &result.UserName, &result.UserIconName)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// ForumPostTableSelectPostsForDashboardOrderBy1 ...
const (
	ForumPostTableSelectPostsForDashboardOrderBy1CreatedAt = iota
	ForumPostTableSelectPostsForDashboardOrderBy1Votes
	ForumPostTableSelectPostsForDashboardOrderBy1CmtCount
)

// ForumPostTableSelectPostsForDashboardResult ...
type ForumPostTableSelectPostsForDashboardResult struct {
	ID         uint64     `json:"-"`
	Title      string     `json:"title,omitempty"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	CmtCount   uint       `json:"cmtCount,omitempty"`
	Votes      uint       `json:"votes,omitempty"`
}

// SelectPostsForDashboard ...
func (da *TableTypeForumPost) SelectPostsForDashboard(queryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]*ForumPostTableSelectPostsForDashboardResult, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case ForumPostTableSelectPostsForDashboardOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case ForumPostTableSelectPostsForDashboardOrderBy1Votes:
		orderBy1SQL = "`votes`"
	case ForumPostTableSelectPostsForDashboardOrderBy1CmtCount:
		orderBy1SQL = "`cmt_count`"
	default:
		err := fmt.Errorf("Unsupported value %v", orderBy1)
		return nil, false, err
	}
	if orderBy1Desc {
		orderBy1SQL += " DESC"
	}

	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `id`, `title`, `created_at`, `modified_at`, `cmt_count`, `votes` FROM `forum_post` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ForumPostTableSelectPostsForDashboardResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ForumPostTableSelectPostsForDashboardResult{}
			err = rows.Scan(&item.ID, &item.Title, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount, &item.Votes)
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

// ForumPostTableSelectPostsForUserProfileResult ...
type ForumPostTableSelectPostsForUserProfileResult struct {
	ID         uint64     `json:"-"`
	Title      string     `json:"title,omitempty"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	CmtCount   uint       `json:"cmtCount,omitempty"`
	Votes      uint       `json:"votes,omitempty"`
}

// SelectPostsForUserProfile ...
func (da *TableTypeForumPost) SelectPostsForUserProfile(queryable mingru.Queryable, userID uint64, page int, pageSize int) ([]*ForumPostTableSelectPostsForUserProfileResult, bool, error) {
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `id`, `title`, `created_at`, `modified_at`, `cmt_count`, `votes` FROM `forum_post` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ForumPostTableSelectPostsForUserProfileResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ForumPostTableSelectPostsForUserProfileResult{}
			err = rows.Scan(&item.ID, &item.Title, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount, &item.Votes)
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

// ForumPostTableSelectPostSourceResult ...
type ForumPostTableSelectPostSourceResult struct {
	Title   string `json:"title,omitempty"`
	Content string `json:"content,omitempty"`
}

// SelectPostSource ...
func (da *TableTypeForumPost) SelectPostSource(queryable mingru.Queryable, id uint64, userID uint64) (*ForumPostTableSelectPostSourceResult, error) {
	result := &ForumPostTableSelectPostSourceResult{}
	err := queryable.QueryRow("SELECT `title`, `content` FROM `forum_post` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Title, &result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}
