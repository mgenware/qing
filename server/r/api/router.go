package api

import (
	"qing/app/handler"
	"qing/r/api/pri"
	"qing/r/api/pub"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Mount("/r", pri.Router)
	Router.Mount("/p", pub.Router)
}
