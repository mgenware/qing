/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package likeapi

import (
	"qing/a/def/frozenDef"
	"qing/da"
)

var dbSources = map[frozenDef.ContentBaseType]da.LikeInterface{
	frozenDef.ContentBaseTypePost:  da.PostLike,
	frozenDef.ContentBaseTypeCmt:   da.CmtLike,
	frozenDef.ContentBaseTypeFPost: da.FPostLike,
}
