/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package apicom

import (
	"fmt"
	"qing/a/defs"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func GetCmtHostTable(hostType int) (mingru.Table, error) {
	switch hostType {
	case defs.Shared.EntityPost:
		return da.Post, nil
	case defs.Shared.EntityQuestion:
		return da.Question, nil
	case defs.Shared.EntityAnswer:
		return da.Answer, nil
	default:
		return nil, fmt.Errorf("unknown cmt host table %v", hostType)
	}
}

func GetCmtRelationTable(hostType int) (mingru.Table, error) {
	switch hostType {
	case defs.Shared.EntityPost:
		return da.PostCmt, nil
	case defs.Shared.EntityQuestion:
		return da.QuestionCmt, nil
	case defs.Shared.EntityAnswer:
		return da.AnswerCmt, nil
	default:
		return nil, fmt.Errorf("unknown cmt relation table %v", hostType)
	}
}
