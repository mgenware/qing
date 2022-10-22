/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package apicom

import (
	"fmt"
	"qing/a/appURL"
	"qing/a/def/appdef"
	"qing/lib/clib"
)

func GetCmtPostHostLink(host *clib.EntityInfo, cmtID uint64) (string, error) {
	switch host.Type {
	case appdef.ContentBaseTypePost:
		return appURL.Get().PostAdv(host.ID, cmtID), nil

	case appdef.ContentBaseTypeFPost:
		return appURL.Get().FPostAdv(host.ID, cmtID), nil

	default:
		return "", fmt.Errorf("unsupported content type %v in `GetCmtPostHostLink`, post ID: %v, cmt ID: %v", host.Type, host.ID, cmtID)
	}
}
