package userapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/find-by-id", findUserByID)
	Router.Post("/find-by-name", findUsersByName)
}
