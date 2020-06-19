/******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypeCmt ...
type TableTypeCmt struct {
}

// Cmt ...
var Cmt = &TableTypeCmt{}

// ------------ Actions ------------

// EditCmt ...
func (da *TableTypeCmt) EditCmt(queryable dbx.Queryable, id uint64, userID uint64, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `cmt` SET `content` = ? WHERE `id` = ? AND `user_id` = ?", content, id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// CmtTableGetHostIdAndReplyCountResult ...
type CmtTableGetHostIdAndReplyCountResult struct {
	HostID     uint64 `json:"hostID,omitempty"`
	ReplyCount uint   `json:"replyCount,omitempty"`
}

// GetHostIdAndReplyCount ...
func (da *TableTypeCmt) GetHostIdAndReplyCount(queryable dbx.Queryable, id uint64) (*CmtTableGetHostIdAndReplyCountResult, error) {
	result := &CmtTableGetHostIdAndReplyCountResult{}
	err := queryable.QueryRow("SELECT `host_id`, `reply_count` FROM `cmt` WHERE `id` = ?", id).Scan(&result.HostID, &result.ReplyCount)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// CmtTableSelectCmtSourceResult ...
type CmtTableSelectCmtSourceResult struct {
	Content string `json:"content,omitempty"`
}

// SelectCmtSource ...
func (da *TableTypeCmt) SelectCmtSource(queryable dbx.Queryable, id uint64, userID uint64) (*CmtTableSelectCmtSourceResult, error) {
	result := &CmtTableSelectCmtSourceResult{}
	err := queryable.QueryRow("SELECT `content` FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateReplyCount ...
func (da *TableTypeCmt) UpdateReplyCount(queryable dbx.Queryable, id uint64, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `cmt` SET `reply_count` = `reply_count` + ? WHERE `id` = ? AND `user_id` = ?", offset, id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}
