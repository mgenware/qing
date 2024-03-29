/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import (
	"fmt"
	"qing/a/def/frozenDef"
	"qing/da"

	"github.com/mgenware/mingru-go-lib"
)

func FetchEntityTitle(db mingru.Queryable, entity *EntityInfo) (string, error) {
	id := entity.ID
	switch entity.Type {
	case frozenDef.ContentBaseTypePost:
		return da.Post.SelectTitle(db, id)

	case frozenDef.ContentBaseTypeFPost:
		return da.FPost.SelectTitle(db, id)

	default:
		return "", fmt.Errorf("unsupported type in `FetchEntityTitle`: %v", entity)
	}
}
