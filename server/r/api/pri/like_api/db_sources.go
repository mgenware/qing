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
