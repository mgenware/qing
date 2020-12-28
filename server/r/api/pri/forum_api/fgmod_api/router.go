package fgmodapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(RequireGroupModeJSONMiddleware)

	Router.Get("/set-info", setInfo)
	Router.Get("/get-info", getInfo)
}
