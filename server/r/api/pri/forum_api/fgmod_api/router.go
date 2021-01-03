package fgmodapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(RequireGroupModeJSONMiddleware)

	Router.Post("/set-info", setInfo)
	Router.Post("/get-info", getInfo)
}
