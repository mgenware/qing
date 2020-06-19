package t

import (
	"github.com/go-chi/chi"
)

var Router = chi.NewRouter()

func init() {
	Router.Get("/views", viewsGET)

	r := chi.NewRouter()
	r.Get("/in/{uid}", signInGET)
	r.Get("/out", signOutGET)
	r.Get("/info", userInfoGET)
	Router.Mount("/auth", r)
}
