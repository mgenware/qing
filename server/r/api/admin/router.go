package admin

import (
	"qing/app"
	"qing/app/handler"
	"qing/app/middleware"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Core.Use(app.UserManager.RequireLoginMiddlewareJSON)
	Router.Core.Use(app.UserManager.UnsafeRequireAdminMiddlewareJSON)
	Router.Core.Use(middleware.ParseJSONRequest)

	Router.Mount("/admin", admin.Router)
}
