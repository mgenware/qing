/******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/mgenware/mingru-go-lib"
)

// TableTypeQuestion ...
type TableTypeQuestion struct {
}

// Question ...
var Question = &TableTypeQuestion{}

// ------------ Actions ------------

func (da *TableTypeQuestion) deleteCmtChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) deleteCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64, replyCount uint) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` - ? - 1 WHERE `id` = ? AND `user_id` = ?", replyCount, hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// DeleteCmt ...
func (da *TableTypeQuestion) DeleteCmt(db *sql.DB, id uint64, userID uint64) error {
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

func (da *TableTypeQuestion) deleteItemChild1(queryable mingru.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `question` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) deleteItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateQuestionCount(queryable, userID, -1)
}

// DeleteItem ...
func (da *TableTypeQuestion) DeleteItem(db *sql.DB, id uint64, userID uint64) error {
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

// QuestionTableDeleteReplyChild1Result ...
type QuestionTableDeleteReplyChild1Result struct {
	ParentID     uint64 `json:"parentID,omitempty"`
	ParentHostID uint64 `json:"parentHostID,omitempty"`
}

func (da *TableTypeQuestion) deleteReplyChild1(queryable mingru.Queryable, id uint64) (*QuestionTableDeleteReplyChild1Result, error) {
	result := &QuestionTableDeleteReplyChild1Result{}
	err := queryable.QueryRow("SELECT `reply`.`parent_id` AS `parent_id`, `join_1`.`host_id` AS `parent_host_id` FROM `reply` AS `reply` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `reply`.`parent_id` WHERE `reply`.`id` = ?", id).Scan(&result.ParentID, &result.ParentHostID)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (da *TableTypeQuestion) deleteReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` -1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) deleteReplyChild4(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, -1)
}

// DeleteReply ...
func (da *TableTypeQuestion) DeleteReply(db *sql.DB, id uint64, userID uint64) error {
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
func (da *TableTypeQuestion) EditItem(queryable mingru.Queryable, id uint64, userID uint64, title string, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `question` SET `modified_at` = UTC_TIMESTAMP(), `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?", title, content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (da *TableTypeQuestion) insertCmtChild1(queryable mingru.Queryable, content string, userID uint64, hostID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `cmt` (`content`, `user_id`, `created_at`, `modified_at`, `host_id`, `reply_count`) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), ?, 0)", content, userID, hostID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeQuestion) insertCmtChild2(queryable mingru.Queryable, cmtID uint64, hostID uint64) error {
	_, err := queryable.Exec("INSERT INTO `question_cmt` (`cmt_id`, `host_id`) VALUES (?, ?)", cmtID, hostID)
	return err
}

func (da *TableTypeQuestion) insertCmtChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertCmt ...
func (da *TableTypeQuestion) InsertCmt(db *sql.DB, content string, userID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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

func (da *TableTypeQuestion) insertItemChild1(queryable mingru.Queryable, title string, content string, userID uint64) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `question` (`title`, `content`, `user_id`, `created_at`, `modified_at`, `cmt_count`, `votes`, `up_votes`, `down_votes`, `answer_count`) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, 0, 0)", title, content, userID)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeQuestion) insertItemChild2(queryable mingru.Queryable, userID uint64) error {
	return UserStats.UpdateQuestionCount(queryable, userID, 1)
}

// InsertItem ...
func (da *TableTypeQuestion) InsertItem(db *sql.DB, title string, content string, userID uint64, sanitizedStub int, captStub int) (uint64, error) {
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

func (da *TableTypeQuestion) insertReplyChild2(queryable mingru.Queryable, id uint64, userID uint64) error {
	return Cmt.UpdateReplyCount(queryable, id, userID, 1)
}

func (da *TableTypeQuestion) insertReplyChild3(queryable mingru.Queryable, hostID uint64, userID uint64) error {
	result, err := queryable.Exec("UPDATE `question` SET `cmt_count` = `cmt_count` + 1 WHERE `id` = ? AND `user_id` = ?", hostID, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// InsertReply ...
func (da *TableTypeQuestion) InsertReply(db *sql.DB, content string, userID uint64, toUserID uint64, parentID uint64, hostID uint64, sanitizedStub int, captStub int) (uint64, error) {
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
func (da *TableTypeQuestion) SelectCmts(queryable mingru.Queryable, hostID uint64, page int, pageSize int) ([]*CmtData, bool, error) {
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
	rows, err := queryable.Query("SELECT `question_cmt`.`cmt_id` AS `cmt_id`, `join_1`.`content` AS `content`, `join_1`.`created_at` AS `created_at`, `join_1`.`modified_at` AS `modified_at`, `join_1`.`reply_count` AS `reply_count`, `join_1`.`user_id` AS `user_id`, `join_2`.`name` AS `user_name`, `join_2`.`icon_name` AS `user_icon_name` FROM `question_cmt` AS `question_cmt` INNER JOIN `cmt` AS `join_1` ON `join_1`.`id` = `question_cmt`.`cmt_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `join_1`.`user_id` WHERE `question_cmt`.`host_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", hostID, limit, offset)
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

// QuestionTableSelectItemByIDResult ...
type QuestionTableSelectItemByIDResult struct {
	ID           uint64     `json:"-"`
	UserID       uint64     `json:"-"`
	UserName     string     `json:"-"`
	UserIconName string     `json:"-"`
	CreatedAt    time.Time  `json:"createdAt,omitempty"`
	ModifiedAt   *time.Time `json:"modifiedAt,omitempty"`
	ContentHTML  string     `json:"contentHTML,omitempty"`
	Title        string     `json:"title,omitempty"`
	CmtCount     uint       `json:"cmtCount,omitempty"`
	AnswerCount  uint       `json:"answerCount,omitempty"`
}

// SelectItemByID ...
func (da *TableTypeQuestion) SelectItemByID(queryable mingru.Queryable, id uint64) (*QuestionTableSelectItemByIDResult, error) {
	result := &QuestionTableSelectItemByIDResult{}
	err := queryable.QueryRow("SELECT `question`.`id` AS `id`, `question`.`user_id` AS `user_id`, `join_1`.`name` AS `user_name`, `join_1`.`icon_name` AS `user_icon_name`, `question`.`created_at` AS `created_at`, `question`.`modified_at` AS `modified_at`, `question`.`content` AS `content`, `question`.`title` AS `title`, `question`.`cmt_count` AS `cmt_count`, `question`.`answer_count` AS `answer_count` FROM `question` AS `question` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `question`.`user_id` WHERE `question`.`id` = ?", id).Scan(&result.ID, &result.UserID, &result.UserName, &result.UserIconName, &result.CreatedAt, &result.ModifiedAt, &result.ContentHTML, &result.Title, &result.CmtCount, &result.AnswerCount)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// QuestionTableSelectItemForEditingResult ...
type QuestionTableSelectItemForEditingResult struct {
	ID          uint64 `json:"-"`
	Title       string `json:"title,omitempty"`
	ContentHTML string `json:"contentHTML,omitempty"`
}

// SelectItemForEditing ...
func (da *TableTypeQuestion) SelectItemForEditing(queryable mingru.Queryable, id uint64, userID uint64) (*QuestionTableSelectItemForEditingResult, error) {
	result := &QuestionTableSelectItemForEditingResult{}
	err := queryable.QueryRow("SELECT `id`, `title`, `content` FROM `question` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.ID, &result.Title, &result.ContentHTML)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// QuestionTableSelectItemsForDashboardOrderBy1 ...
const (
	QuestionTableSelectItemsForDashboardOrderBy1CreatedAt = iota
	QuestionTableSelectItemsForDashboardOrderBy1AnswerCount
)

// QuestionTableSelectItemsForDashboardResult ...
type QuestionTableSelectItemsForDashboardResult struct {
	ID          uint64     `json:"-"`
	CreatedAt   time.Time  `json:"createdAt,omitempty"`
	ModifiedAt  *time.Time `json:"modifiedAt,omitempty"`
	Title       string     `json:"title,omitempty"`
	AnswerCount uint       `json:"answerCount,omitempty"`
}

// SelectItemsForDashboard ...
func (da *TableTypeQuestion) SelectItemsForDashboard(queryable mingru.Queryable, userID uint64, page int, pageSize int, orderBy1 int, orderBy1Desc bool) ([]*QuestionTableSelectItemsForDashboardResult, bool, error) {
	var orderBy1SQL string
	switch orderBy1 {
	case QuestionTableSelectItemsForDashboardOrderBy1CreatedAt:
		orderBy1SQL = "`created_at`"
	case QuestionTableSelectItemsForDashboardOrderBy1AnswerCount:
		orderBy1SQL = "`answer_count`"
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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `title`, `answer_count` FROM `question` WHERE `user_id` = ? ORDER BY "+orderBy1SQL+" LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*QuestionTableSelectItemsForDashboardResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &QuestionTableSelectItemsForDashboardResult{}
			err = rows.Scan(&item.ID, &item.CreatedAt, &item.ModifiedAt, &item.Title, &item.AnswerCount)
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

// QuestionTableSelectItemsForUserProfileResult ...
type QuestionTableSelectItemsForUserProfileResult struct {
	ID         uint64     `json:"-"`
	CreatedAt  time.Time  `json:"createdAt,omitempty"`
	ModifiedAt *time.Time `json:"modifiedAt,omitempty"`
	Title      string     `json:"title,omitempty"`
}

// SelectItemsForUserProfile ...
func (da *TableTypeQuestion) SelectItemsForUserProfile(queryable mingru.Queryable, userID uint64, page int, pageSize int) ([]*QuestionTableSelectItemsForUserProfileResult, bool, error) {
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
	rows, err := queryable.Query("SELECT `id`, `created_at`, `modified_at`, `title` FROM `question` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT ? OFFSET ?", userID, limit, offset)
	if err != nil {
		return nil, false, err
	}
	result := make([]*QuestionTableSelectItemsForUserProfileResult, 0, limit)
	itemCounter := 0
	defer rows.Close()
	for rows.Next() {
		itemCounter++
		if itemCounter <= max {
			item := &QuestionTableSelectItemsForUserProfileResult{}
			err = rows.Scan(&item.ID, &item.CreatedAt, &item.ModifiedAt, &item.Title)
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

// UpdateMsgCount ...
func (da *TableTypeQuestion) UpdateMsgCount(queryable mingru.Queryable, id uint64, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `question` SET `answer_count` = `answer_count` + ? WHERE `id` = ? AND `user_id` = ?", offset, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
