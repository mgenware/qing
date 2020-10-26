package likeapi

import (
	"qing/app/defs"
	"qing/da"
)

var dbSources = map[int]da.LikeInterface{
	defs.Constants.EntityPost: da.PostLike,
}
