package likeapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/get", getLike)
	Router.Post("/set", setLike)
}
