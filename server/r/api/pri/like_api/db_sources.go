/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package likeapi

import (
	"qing/da"
)

var dbSources = map[int]da.LikeInterface{
	appdef.EntityPost:     da.PostLike,
	appdef.EntityCmt:      da.CmtLike,
	appdef.EntityQuestion: da.QuestionLike,
}
