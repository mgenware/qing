/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import (
	"fmt"
	"qing/a/def/appdef"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func FetchEntityTitle(db mingru.Queryable, entity *EntityInfo) (string, error) {
	id := entity.ID
	switch entity.Type {
	case appdef.ContentBaseTypePost:
		return da.Post.SelectTitle(db, id)

	case appdef.contentBaseTypeFPost:
		return da.FPost.SelectTitle(db, id)

	default:
		return "", fmt.Errorf("unsupported type in `FetchEntityTitle`: %v", entity)
	}
}
