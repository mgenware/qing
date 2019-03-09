package settings

import (
	"qing/r/sr/settings/profilec"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Mount("/profile", profilec.Router)
}
