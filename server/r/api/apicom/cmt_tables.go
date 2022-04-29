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
		return da.TablePost, nil
	case dbdef.CmtHostTypeThread:
		return da.TableThread, nil
	case dbdef.CmtHostTypeThreadMsg:
		return da.TableThreadMsg, nil
	default:
		return "", fmt.Errorf("unknown cmt host table %v", hostType)
	}
}

func GetCmtRelationTable(hostType dbdef.CmtHostType) (mingru.Table, error) {
	switch hostType {
	case dbdef.CmtHostTypePost:
		return da.TablePostCmt, nil
	case dbdef.CmtHostTypeThread:
		return da.TableThreadCmt, nil
	case dbdef.CmtHostTypeThreadMsg:
		return da.TableThreadMsgCmt, nil
	default:
		return "", fmt.Errorf("unknown cmt relation table %v", hostType)
	}
}
