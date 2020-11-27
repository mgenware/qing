package mpapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/posts", myPosts)
	Router.Post("/discussions", myDiscussions)
}
