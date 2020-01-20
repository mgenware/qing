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

// DeleteCmt ...
func (da *TableTypeCmt) DeleteCmt(queryable dbx.Queryable, id uint64, userID uint64) error {
	result, err := queryable.Exec("DELETE FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// EditCmt ...
func (da *TableTypeCmt) EditCmt(queryable dbx.Queryable, id uint64, userID uint64, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `cmt` SET `content` = ? WHERE `id` = ? AND `user_id` = ?", content, id, userID)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// CmtTableSelectCmtForEditingResult ...
type CmtTableSelectCmtForEditingResult struct {
	Content string `json:"content"`
}

// SelectCmtForEditing ...
func (da *TableTypeCmt) SelectCmtForEditing(queryable dbx.Queryable, id uint64, userID uint64) (*CmtTableSelectCmtForEditingResult, error) {
	result := &CmtTableSelectCmtForEditingResult{}
	err := queryable.QueryRow("SELECT `content` FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.Content)
	if err != nil {
		return nil, err
	}
	return result, nil
}
