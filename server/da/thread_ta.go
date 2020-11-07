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

// TableTypeThread ...
type TableTypeThread struct {
}

// Thread ...
var Thread = &TableTypeThread{}

// ------------ Actions ------------

func (da *TableTypeThread) deleteCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThread) deleteCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `thread` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ? AND `user_id` = ?", replyCount, hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypeThread) DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
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
		err = da.deleteCmtChild3(tx, hostIDAndReplyCount.HostID, userID, hostIDAndReplyCount.ReplyCount)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

func (da *TableTypeThread) deleteItemChild1(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `thread` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThread) deleteItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateThreadCount(queryable, userID, -1)
}

// DeleteItem ...
func (da *TableTypeThread) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		err = da.deleteItemChild1(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteItemChild2(tx, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

func (da *TableTypeThread) deleteReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `thread` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThread) deleteReplyChild4(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, -1)
}

// DeleteReply ...
func (da *TableTypeThread) DeleteReply(db *sql.DB, id uint64, userID uint64, hostID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		parentID, err := Reply.GetParentID(tx, id)
		if err != nil {
			return err
		}
		err = Reply.DeleteReply(tx, id, userID)
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

// EditItem ...
func (da *TableTypeThread) EditItem(queryable mingru.Queryable, id uint64, userID uint64, title string, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `thread` SET `modified_at` = UTC_TIMESTAMP(), `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?", title, content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThread) insertCmtChild1(queryable mingru.Queryable, content string, userID uint64, hostID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `host_id`, `reply_count`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, 0)", content, userID, hostID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeThread) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `thread_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (da *TableTypeThread) insertCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `thread` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypeThread) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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

func (da *TableTypeThread) insertItemChild1(queryable mingru.Queryable, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `thread` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `cmt_count`, `votes`, `up_votes`, `down_votes`, `msg_count`) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, 0, 0)", title, content, userID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeThread) insertItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateThreadCount(queryable, userID, 1)
}

// InsertItem ...
func (da *TableTypeThread) InsertItem(db *sql.DB, title string, content string, userID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := da.insertItemChild1(tx, title, content, userID)
		if err != nil {
			return err
		}
		err = da.insertItemChild2(tx, userID)
		if err != nil {
			return err
		}
		insertedIDExported = insertedID
		return nil
	})
	return insertedIDExported, txErr
}

func (da *TableTypeThread) insertReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, 1)
}

func (da *TableTypeThread) insertReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `thread` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypeThread) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := Reply.InsertReply(tx, content, userID, toUserID, parentID)
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
func (da *TableTypeThread) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]*CmtData, bool, error) {
	if page <= 0 {
		err := fmt.Errorf("Invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("Invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `thread_cmt`.`cmt_id` AS `cmtID`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `createdAt`, `join_1`.`modified_at` AS `modifiedAt`, `join_1`.`reply_count` AS `replyCount`, `join_1`.`user_id` AS `userID`, `join_2`.`name` AS `userName`, `join_2`.`icon_name` AS `userIconName` FROM `thread_cmt` AS `thread_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `thread_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `thread_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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

// ThreadTableSelectItemByIDResult ...
type ThreadTableSelectItemByIDResult struct {
	ID           uint64     `json:"-"`
	Title        string     `json:"title,omitempty"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	CmtCount     uint       `json:"cmtCount,omitempty"`
	MsgCount     uint       `json:"msgCount,omitempty"`
	ContentHTML  string     `json:"contentHtml,omitempty"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"-"`
	UserIconName string     `json:"-"`
}

// SelectItemByID ...
func (da *TableTypeThread) SelectItemByID(queryable mingru.Queryable, id uint64) (*ThreadTableSelectItemByIDResult, error) {
	result := &ThreadTableSelectItemByIDResult{}
	err := queryable.QueryRow("SELECT `thread`.`id` AS `id`, `thread`.`title` AS `title`, `thread`.`created_at` AS `createdAt`, `thread`.`modified_at` AS `modifiedAt`, `thread`.`cmt_count` AS `cmtCount`, `thread`.`msg_count` AS `msgCount`, `thread`.`content` AS `content`, `thread`.`user_id` AS `userID`, `join_1`.`name` AS `userName`, `join_1`.`icon_name` AS `userIconName` FROM `thread` AS `thread` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `thread`.`user_id` WHERE `thread`.`id` = ?", id).Scan(&result.ID, &result.Title, &result.CreatedAt, &result.ModifiedAt, &result.CmtCount, &result.MsgCount, &result.ContentHTML, &result.UserID, &result.UserName, &result.UserIconName)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// ThreadTableSelectItemsForDashboardOrderBy1 ...
const (
	ThreadTableSelectItemsForDashboardOrderBy1CreatedAt = iota
	ThreadTableSelectItemsForDashboardOrderBy1MsgCount
)

// ThreadTableSelectItemsForDashboardResult ...
type ThreadTableSelectItemsForDashboardResult struct {
	ID         uint64     `json:"-"`
	Title      string     `json:"title,omitempty"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	CmtCount   uint       `json:"cmtCount,omitempty"`
	MsgCount   uint       `json:"msgCount,omitempty"`
}

// SelectItemsForDashboard ...
func (da *TableTypeThread) SelectItemsForDashboard(queryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]*ThreadTableSelectItemsForDashboardResult, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case ThreadTableSelectItemsForDashboardOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case ThreadTableSelectItemsForDashboardOrderBy1MsgCount:
		orderBy1SQL = "`msg_count`"
	default:
		err := fmt.Errorf("Unsupported value %v", orderBy1)
		return nil, false, err
	}
	if orderBy1Desc {
		orderBy1SQL += " DESC"
	}

	if page <= 0 {
		err := fmt.Errorf("Invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("Invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `id`, `title`, `created_at`, `modified_at`, `cmt_count`, `msg_count` FROM `thread` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ThreadTableSelectItemsForDashboardResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ThreadTableSelectItemsForDashboardResult{}
			err = rows.Scan(&item.ID, &item.Title, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount, &item.MsgCount)
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

// ThreadTableSelectItemsForUserProfileResult ...
type ThreadTableSelectItemsForUserProfileResult struct {
	ID         uint64     `json:"-"`
	Title      string     `json:"title,omitempty"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	CmtCount   uint       `json:"cmtCount,omitempty"`
	MsgCount   uint       `json:"msgCount,omitempty"`
}

// SelectItemsForUserProfile ...
func (da *TableTypeThread) SelectItemsForUserProfile(queryable mingru.Queryable, userID uint64, page int, pageSize int) ([]*ThreadTableSelectItemsForUserProfileResult, bool, error) {
	if page <= 0 {
		err := fmt.Errorf("Invalid page %v", page)
		return nil, false, err
	}
	if pageSize <= 0 {
		err := fmt.Errorf("Invalid page size %v", pageSize)
		return nil, false, err
	}
	limit := pageSize + 1
	offset := (page - 1) * pageSize
	max := pageSize
	rows, err := queryable.Query("SELECT `id`, `title`, `created_at`, `modified_at`, `cmt_count`, `msg_count` FROM `thread` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ThreadTableSelectItemsForUserProfileResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ThreadTableSelectItemsForUserProfileResult{}
			err = rows.Scan(&item.ID, &item.Title, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount, &item.MsgCount)
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

// ThreadTableSelectItemSourceResult ...
type ThreadTableSelectItemSourceResult struct {
	Title       string `json:"title,omitempty"`
	ContentHTML string `json:"contentHtml,omitempty"`
}

// SelectItemSource ...
func (da *TableTypeThread) SelectItemSource(queryable mingru.Queryable, id uint64, userID uint64) (*ThreadTableSelectItemSourceResult, error) {
	result := &ThreadTableSelectItemSourceResult{}
	err := queryable.QueryRow("SELECT `title`, `content` FROM `thread` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Title, &result.ContentHTML)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateMsgCount ...
func (da *TableTypeThread) UpdateMsgCount(queryable mingru.Queryable, id uint64, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `thread` SET `msg_count` = `msg_count` + ? WHERE `id` = ? AND `user_id` = ?", offset, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
