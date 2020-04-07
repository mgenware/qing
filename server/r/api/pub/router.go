package pub

import (
	"qing/app/handler"
	"qing/app/middleware"
	authapi "qing/r/api/pub/auth_api"
	cmtapi "qing/r/api/pub/cmt_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(middleware.ParseJSONRequest)

	Router.Mount("/cmt", cmtapi.Router)
	Router.Mount("/auth", authapi.Router)
}
