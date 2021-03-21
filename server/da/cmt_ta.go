/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

 /******************************************************************************************
  * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/

package da

import "github.com/mgenware/mingru-go-lib"

// TableTypeCmt ...
type TableTypeCmt struct {
}

// Cmt ...
var Cmt = &TableTypeCmt{}

// ------------ Actions ------------

// EditCmt ...
func (da *TableTypeCmt) EditCmt(queryable mingru.Queryable, id uint64, userID uint64, content string, sanitizedStub int) error {
	result, err := queryable.Exec("UPDATE `cmt` SET `content` = ? WHERE `id` = ? AND `user_id` = ?", content, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// CmtTableSelectCmtSourceResult ...
type CmtTableSelectCmtSourceResult struct {
	ContentHTML string `json:"contentHTML,omitempty"`
}

// SelectCmtSource ...
func (da *TableTypeCmt) SelectCmtSource(queryable mingru.Queryable, id uint64, userID uint64) (CmtTableSelectCmtSourceResult, error) {
	var result CmtTableSelectCmtSourceResult
	err := queryable.QueryRow("SELECT `content` FROM `cmt` WHERE `id` = ? AND `user_id` = ?", id, userID).Scan(&result.ContentHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UpdateReplyCount ...
func (da *TableTypeCmt) UpdateReplyCount(queryable mingru.Queryable, id uint64, userID uint64, offset int) error {
	result, err := queryable.Exec("UPDATE `cmt` SET `reply_count` = `reply_count` + ? WHERE `id` = ? AND `user_id` = ?", offset, id, userID)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
