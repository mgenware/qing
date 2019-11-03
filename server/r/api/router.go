package api

import (
	"qing/r/api/pri"
	"qing/r/api/pub"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Mount("/r", pri.Router)
	Router.Mount("/p", pub.Router)
}
