package t

import (
	"github.com/go-chi/chi"
)

var Router = chi.NewRouter()

func init() {
	Router.Get("/views", views)
	Router.Get("/", home)

	// Auth router
	authRouter := chi.NewRouter()
	authRouter.Get("/in/{uid}", signIn)
	authRouter.Get("/out", signOut)
	authRouter.Get("/info", userInfo)
	Router.Mount("/auth", authRouter)
}
