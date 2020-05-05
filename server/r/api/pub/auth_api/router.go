package authapi

import "qing/app/handler"

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Post("/create-pwd-user", createPwdUserPOST)
	Router.Post("/signin", signInPOST)
}
