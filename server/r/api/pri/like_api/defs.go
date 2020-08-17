package likeapi

import (
	"qing/app/defs"
	"qing/da"
)

var dbSources = map[int]da.LikeInterface{
	defs.EntityPost: da.PostLike,
}
