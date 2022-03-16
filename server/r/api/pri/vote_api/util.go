/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package voteapi

import (
	"database/sql"
	"qing/a/appDB"
	"qing/a/def"
	"qing/da"
)

// FetchMyVote fetches the current vote status from DB and converts
// DB values to values in shared constants.
func FetchMyVote(aid, uid uint64) (int, error) {
	if uid == 0 {
		return 0, nil
	}
	val, err := da.AnswerVote.MyVote(appDB.DB(), aid, uid)
	if err != nil {
		if err == sql.ErrNoRows {
			return def.App.NoVoteValue, nil
		}
		return 0, err
	}
	if val {
		return def.App.UpVoteValue, nil
	}
	return def.App.DownVoteValue, nil
}
