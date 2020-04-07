package cmtapi

import (
	"qing/app/handler"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/get", getCmts)
}
