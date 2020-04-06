package composeapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/set-post", setPost)
	Router.Post("/get-post-src", getPostSource)
	Router.Post("/delete-post", deletePost)
	Router.Post("/set-cmt", setCmt)
	Router.Post("/get-cmt-src", getCmtSource)
	Router.Post("/delete-cmt", deleteCmt)
}
