package adminapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/set-admin", setAdmin)
	Router.Post("/get-admins", getAdmins)
}
