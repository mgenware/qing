package pub

import (
	"qing/app/middleware"
	cmtapi "qing/r/api/pub/cmt_api"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Use(middleware.ParseJSONRequest)

	Router.Mount("/cmt", cmtapi.Router)
}
