package t

import (
	"github.com/go-chi/chi"
)

var Router = chi.NewRouter()

func init() {
	Router.Get("/views", viewsGET)
	Router.Get("/", rootGET)

	// Auth router
	authRouter := chi.NewRouter()
	authRouter.Get("/in/{uid}", signInGET)
	authRouter.Get("/out", signOutGET)
	authRouter.Get("/info", userInfoGET)
	Router.Mount("/auth", authRouter)
}
