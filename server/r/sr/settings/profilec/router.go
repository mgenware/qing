package profilec

import (
	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Post("/get_info", getInfo)
	Router.Post("/set_info", setInfo)
	Router.Post("/set_avatar", uploadAvatar)
}
