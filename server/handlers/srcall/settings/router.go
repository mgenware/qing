package settings

import (
	"qing/handlers/srCall/settings/profile"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Mount("/profile", profile.Router)
}
