/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package apicom

import (
	"fmt"
	"qing/a/def/frozenDef"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func GetCmtHostTable(hostType frozenDef.ContentBaseType) (mingru.Table, error) {
	switch hostType {
	case frozenDef.ContentBaseTypePost:
		return da.TablePost, nil
	case frozenDef.ContentBaseTypeFPost:
		return da.TableFPost, nil
	default:
		return "", fmt.Errorf("unknown cmt host table %v", hostType)
	}
}

func GetCmtRelationTable(hostType frozenDef.ContentBaseType) (mingru.Table, error) {
	switch hostType {
	case frozenDef.ContentBaseTypePost:
		return da.TablePostCmt, nil
	case frozenDef.ContentBaseTypeFPost:
		return da.TableFPostCmt, nil
	default:
		return "", fmt.Errorf("unknown cmt relation table %v", hostType)
	}
}
