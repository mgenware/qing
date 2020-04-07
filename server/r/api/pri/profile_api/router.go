package profileapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/get-info", getInfo)
	Router.Post("/set-info", setInfo)
	Router.Core.Post("/set-avatar", uploadAvatar)
	Router.Post("/set-bio", setBio)
}
