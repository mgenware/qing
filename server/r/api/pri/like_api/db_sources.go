/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package likeapi

import (
	"qing/app/defs"
	"qing/da"
)

var dbSources = map[int]da.LikeInterface{
	defs.Shared.EntityPost:  da.PostLike,
	defs.Shared.EntityCmt:   da.CmtLike,
	defs.Shared.EntityReply: da.ReplyLike,
}
