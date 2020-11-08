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

// TableTypeThreadMsg ...
type TableTypeThreadMsg struct {
}

// ThreadMsg ...
var ThreadMsg = &TableTypeThreadMsg{}

// ------------ Actions ------------

func (da *TableTypeThreadMsg) deleteCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThreadMsg) deleteCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `thread_msg` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ? AND `user_id` = ?", replyCount, hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypeThreadMsg) DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		hostIDAndReplyCount, err := Cmt.GetHostIDAndReplyCount(tx, id)
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

func (da *TableTypeThreadMsg) deleteItemChild1(queryable mingru.Queryable, id uint64) (uint64, error) {
	var result uint64
	err := queryable.QueryRow("SELECT `thread_id` FROM `thread_msg` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeThreadMsg) deleteItemChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `thread_msg` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThreadMsg) deleteItemChild3(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Thread.UpdateMsgCount(queryable, id, userID, -1)
}

// DeleteItem ...
func (da *TableTypeThreadMsg) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		threadID, err := da.deleteItemChild1(tx, id)
		if err != nil {
			return err
		}
		err = da.deleteItemChild2(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteItemChild3(tx, threadID, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// ThreadMsgTableDeleteReplyChild1Result ...
type ThreadMsgTableDeleteReplyChild1Result struct {
	ParentID     uint64 `json:"parentID,omitempty"`
	ParentHostID uint64 `json:"parentHostID,omitempty"`
}

func (da *TableTypeThreadMsg) deleteReplyChild1(queryable mingru.Queryable, id uint64) (*ThreadMsgTableDeleteReplyChild1Result, error) {
	result := &ThreadMsgTableDeleteReplyChild1Result{}
	err := queryable.QueryRow("SELECT `reply`.`parent_id` AS `parentID`, `join_1`.`host_id` AS `parentHostID` FROM `reply` AS `reply` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `reply`.`parent_id` WHERE `reply`.`id` = ?", id).Scan(&result.ParentID, &result.ParentHostID)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (da *TableTypeThreadMsg) deleteReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `thread_msg` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThreadMsg) deleteReplyChild4(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, -1)
}

// DeleteReply ...
func (da *TableTypeThreadMsg) DeleteReply(db *sql.DB, id uint64, userID uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		cmtIDAndHostID, err := da.deleteReplyChild1(tx, id)
		if err != nil {
			return err
		}
		err = Reply.DeleteReplyCore(tx, id, userID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild3(tx, cmtIDAndHostID.ParentHostID, userID)
		if err != nil {
			return err
		}
		err = da.deleteReplyChild4(tx, cmtIDAndHostID.ParentID, userID)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// EditItem ...
func (da *TableTypeThreadMsg) EditItem(queryable mingru.Queryable, id uint64, userID uint64, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `thread_msg` SET `modified_at` = UTC_TIMESTAMP(), `content` = ? WHERE `id` = ? AND `user_id` = ?", content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeThreadMsg) insertCmtChild1(queryable mingru.Queryable, content string, userID uint64, hostID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `host_id`, `reply_count`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, 0)", content, userID, hostID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeThreadMsg) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `thread_msg_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (da *TableTypeThreadMsg) insertCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `thread_msg` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypeThreadMsg) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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

func (da *TableTypeThreadMsg) insertItemChild1(queryable mingru.Queryable, content string, userID uint64, threadID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `thread_msg` (`content`, `user_id`, `thread_id`, `created_at`, `modified_at`, `cmt_count`, `votes`, `up_votes`, `down_votes`) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, 0)", content, userID, threadID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeThreadMsg) insertItemChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Thread.UpdateMsgCount(queryable, id, userID, 1)
}

// InsertItem ...
func (da *TableTypeThreadMsg) InsertItem(db *sql.DB, content string, userID uint64, threadID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var insertedIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedID, err := da.insertItemChild1(tx, content, userID, threadID)
		if err != nil {
			return err
		}
		err = da.insertItemChild2(tx, threadID, userID)
		if err != nil {
			return err
		}
		insertedIDExported = insertedID
		return nil
	})
	return insertedIDExported, txErr
}

func (da *TableTypeThreadMsg) insertReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, 1)
}

func (da *TableTypeThreadMsg) insertReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `thread_msg` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypeThreadMsg) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
	var replyIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		replyID, err := Reply.InsertReplyCore(tx, content, userID, toUserID, parentID)
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
func (da *TableTypeThreadMsg) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]*CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `thread_msg_cmt`.`cmt_id` AS `cmtID`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `createdAt`, `join_1`.`modified_at` AS `modifiedAt`, `join_1`.`reply_count` AS `replyCount`, `join_1`.`user_id` AS `userID`, `join_2`.`name` AS `userName`, `join_2`.`icon_name` AS `userIconName` FROM `thread_msg_cmt` AS `thread_msg_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `thread_msg_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `thread_msg_cmt`.`host_id` = ? ORDER BY `join_1`.`created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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
			err = rows.Scan(&item.CmtID, &item.ContentHTML, &item.CreatedAt, &item.ModifiedAt, &item.ReplyCount, &item.UserID, &item.UserName, &item.UserIconName)
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

// ThreadMsgTableSelectItemsByThreadResult ...
type ThreadMsgTableSelectItemsByThreadResult struct {
	ID           uint64     `json:"-"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	CmtCount     uint       `json:"cmtCount,omitempty"`
	ContentHTML  string     `json:"contentHTML,omitempty"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"-"`
	UserIconName string     `json:"-"`
}

// SelectItemsByThread ...
func (da *TableTypeThreadMsg) SelectItemsByThread(queryable mingru.Queryable, threadID uint64, page int, pageSize int) ([]*ThreadMsgTableSelectItemsByThreadResult, bool, error) {
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
	rows, err := queryable.Query("SELECT `thread_msg`.`id` AS `id`, `thread_msg`.`created_at` AS `createdAt`, `thread_msg`.`modified_at` AS `modifiedAt`, `thread_msg`.`cmt_count` AS `cmtCount`, `thread_msg`.`content` AS `content`, `thread_msg`.`user_id` AS `userID`, `join_1`.`name` AS `userName`, `join_1`.`icon_name` AS `userIconName` FROM `thread_msg` AS `thread_msg` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `thread_msg`.`user_id` WHERE `thread_msg`.`thread_id` = ? ORDER BY `thread_msg`.`created_at` LIMIT ? OFFSET ?", threadID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ThreadMsgTableSelectItemsByThreadResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ThreadMsgTableSelectItemsByThreadResult{}
			err = rows.Scan(&item.ID, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount, &item.ContentHTML, &item.UserID, &item.UserName, &item.UserIconName)
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

// ThreadMsgTableSelectItemsForDashboardOrderBy1 ...
const (
	ThreadMsgTableSelectItemsForDashboardOrderBy1CreatedAt = iota
	ThreadMsgTableSelectItemsForDashboardOrderBy1CmtCount
)

// ThreadMsgTableSelectItemsForDashboardResult ...
type ThreadMsgTableSelectItemsForDashboardResult struct {
	ID         uint64     `json:"-"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	CmtCount   uint       `json:"cmtCount,omitempty"`
}

// SelectItemsForDashboard ...
func (da *TableTypeThreadMsg) SelectItemsForDashboard(queryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]*ThreadMsgTableSelectItemsForDashboardResult, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case ThreadMsgTableSelectItemsForDashboardOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case ThreadMsgTableSelectItemsForDashboardOrderBy1CmtCount:
		orderBy1SQL = "`cmt_count`"
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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `cmt_count` FROM `thread_msg` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ThreadMsgTableSelectItemsForDashboardResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ThreadMsgTableSelectItemsForDashboardResult{}
			err = rows.Scan(&item.ID, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount)
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

// ThreadMsgTableSelectItemsForUserProfileResult ...
type ThreadMsgTableSelectItemsForUserProfileResult struct {
	ID         uint64     `json:"-"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	CmtCount   uint       `json:"cmtCount,omitempty"`
}

// SelectItemsForUserProfile ...
func (da *TableTypeThreadMsg) SelectItemsForUserProfile(queryable mingru.Queryable, userID uint64, page int, pageSize int) ([]*ThreadMsgTableSelectItemsForUserProfileResult, bool, error) {
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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `cmt_count` FROM `thread_msg` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*ThreadMsgTableSelectItemsForUserProfileResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &ThreadMsgTableSelectItemsForUserProfileResult{}
			err = rows.Scan(&item.ID, &item.CreatedAt, &item.ModifiedAt, &item.CmtCount)
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

// ThreadMsgTableSelectItemSourceResult ...
type ThreadMsgTableSelectItemSourceResult struct {
	ContentHTML string `json:"contentHTML,omitempty"`
}

// SelectItemSource ...
func (da *TableTypeThreadMsg) SelectItemSource(queryable mingru.Queryable, id uint64, userID uint64) (*ThreadMsgTableSelectItemSourceResult, error) {
	result := &ThreadMsgTableSelectItemSourceResult{}
	err := queryable.QueryRow("SELECT `content` FROM `thread_msg` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.ContentHTML)
	if err != nil {
		return nil, err
	}
	return result, nil
}
