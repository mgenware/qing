package profileService

import (
	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Post("/get-info", getInfo)
	Router.Post("/set-info", setInfo)
	Router.Post("/set-avatar", uploadAvatar)
	Router.Post("/set-bio", setBio)
}
