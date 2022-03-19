/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package likeapi

import (
	"qing/a/def/dbdef"
	"qing/da"
)

var dbSources = map[dbdef.LikeHostType]da.LikeInterface{
	dbdef.LikeHostTypePost: da.PostLike,
	dbdef.LikeHostTypeCmt:  da.CmtLike,
	dbdef.LikeHostTypeQue:  da.QuestionLike,
}
