package composeapi

import (
	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Post("/set-post", setPost)
	Router.Post("/get-post-src", getPostSource)
	Router.Post("/delete-post", deletePost)
	Router.Post("/set-cmt", setCmt)
	Router.Post("/get-cmt-src", getCmtSource)
}
