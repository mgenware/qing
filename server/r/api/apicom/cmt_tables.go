/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package apicom

import (
	"fmt"
	"qing/a/def/dbdef"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func GetCmtHostTable(hostType dbdef.CmtHostType) (mingru.Table, error) {
	switch hostType {
	case dbdef.CmtHostTypePost:
		return da.Post, nil
	case dbdef.CmtHostTypeThread:
		return da.Thread, nil
	case dbdef.CmtHostTypeThreadMsg:
		return da.ThreadMsg, nil
	default:
		return nil, fmt.Errorf("unknown cmt host table %v", hostType)
	}
}

func GetCmtRelationTable(hostType dbdef.CmtHostType) (mingru.Table, error) {
	switch hostType {
	case dbdef.CmtHostTypePost:
		return da.PostCmt, nil
	case dbdef.CmtHostTypeThread:
		return da.ThreadCmt, nil
	case dbdef.CmtHostTypeThreadMsg:
		return da.ThreadMsgCmt, nil
	default:
		return nil, fmt.Errorf("unknown cmt relation table %v", hostType)
	}
}
