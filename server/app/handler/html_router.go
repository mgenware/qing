package handler

import (
	"net/http"

	"github.com/go-chi/chi"
)

// HTMLHandlerFunc is an http.HandlerFunc with a return value representing the result of the handler.
type HTMLHandlerFunc func(http.ResponseWriter, *http.Request) HTML

// HTMLRouter wraps a chi.Router and provides methods for create JSON-related router.
type HTMLRouter struct {
	Core chi.Router
}

// NewHTMLRouter creates a JSON router.
func NewHTMLRouter() *HTMLRouter {
	return &HTMLRouter{Core: chi.NewRouter()}
}

// Connect calls chi.Router.Connect with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Connect(pattern string, h HTMLHandlerFunc) {
	r.Core.Connect(pattern, HTMLHandlerToHTTPHandler(h))
}

// Delete calls chi.Router.Delete with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Delete(pattern string, h HTMLHandlerFunc) {
	r.Core.Delete(pattern, HTMLHandlerToHTTPHandler(h))
}

// Get calls chi.Router.Get with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Get(pattern string, h HTMLHandlerFunc) {
	r.Core.Get(pattern, HTMLHandlerToHTTPHandler(h))
}

// Head calls chi.Router.Head with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Head(pattern string, h HTMLHandlerFunc) {
	r.Core.Head(pattern, HTMLHandlerToHTTPHandler(h))
}

// Options calls chi.Router.Options with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Options(pattern string, h HTMLHandlerFunc) {
	r.Core.Options(pattern, HTMLHandlerToHTTPHandler(h))
}

// Patch calls chi.Router.Patch with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Patch(pattern string, h HTMLHandlerFunc) {
	r.Core.Patch(pattern, HTMLHandlerToHTTPHandler(h))
}

// Post calls chi.Router.Post with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Post(pattern string, h HTMLHandlerFunc) {
	r.Core.Post(pattern, HTMLHandlerToHTTPHandler(h))
}

// Put calls chi.Router.Put with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Put(pattern string, h HTMLHandlerFunc) {
	r.Core.Put(pattern, HTMLHandlerToHTTPHandler(h))
}

// Trace calls chi.Router.Trace with a customized HTMLHandlerFunc.
func (r *HTMLRouter) Trace(pattern string, h HTMLHandlerFunc) {
	r.Core.Connect(pattern, HTMLHandlerToHTTPHandler(h))
}

// Mount calls chi.Router.Mount with a HTMLRouter.
func (r *HTMLRouter) Mount(pattern string, h *HTMLRouter) {
	r.Core.Mount(pattern, h)
}

// ServeHTTP imlements http.Handler.
func (r *HTMLRouter) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	r.Core.ServeHTTP(w, req)
}

// HTMLHandlerToHTTPHandler converts a HTMLHandlerFunc to http.HandlerFunc.
func HTMLHandlerToHTTPHandler(h HTMLHandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		h(w, r)
	}
}
