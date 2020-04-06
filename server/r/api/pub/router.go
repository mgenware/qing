package pub

import (
	"qing/app/middleware"
	authapi "qing/r/api/pub/auth_api"
	cmtapi "qing/r/api/pub/cmt_api"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Use(middleware.ParseJSONRequest)

	Router.Mount("/cmt", cmtapi.Router)
	Router.Mount("/auth", authapi.Router)
}
