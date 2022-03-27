/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package likeapi

import (
	"qing/a/def/appdef"
	"qing/da"
)

var dbSources = map[appdef.ContentBaseType]da.LikeInterface{
	appdef.ContentBaseTypePost:   da.PostLike,
	appdef.ContentBaseTypeCmt:    da.CmtLike,
	appdef.ContentBaseTypeThread: da.ThreadLike,
}
