package fmodapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(RequireForumModeJSONMiddleware)

	Router.Get("/set-info", setInfo)
	Router.Get("/get-info", setInfo)
}
