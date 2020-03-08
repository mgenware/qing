package cmtapi

import (
	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Post("/get", getCmts)
}
