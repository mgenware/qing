/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import "github.com/mgenware/mingru-go-lib"

type TableTypeThreadBaseUtil struct {
}

var ThreadBaseUtil = &TableTypeThreadBaseUtil{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeThreadBaseUtil) MingruSQLName() string {
	return "thread_base_util"
}

// ------------ Actions ------------

func (mrTable *TableTypeThreadBaseUtil) UpdateReplyCount(mrQueryable mingru.Queryable, threadBaseTable mingru.Table, offset int, id uint64) error {
	result, err := mrQueryable.Exec("UPDATE "+threadBaseTable.MingruSQLName()+" SET `reply_count` = `reply_count` + ? WHERE `id` = ?", offset, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
