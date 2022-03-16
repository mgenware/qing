/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package likeapi

import (
	"qing/a/def"
	"qing/da"
)

var dbSources = map[int]da.LikeInterface{
	def.App.EntityPost:     da.PostLike,
	def.App.EntityCmt:      da.CmtLike,
	def.App.EntityQuestion: da.QuestionLike,
}
