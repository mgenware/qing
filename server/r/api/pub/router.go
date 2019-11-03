package pub

import (
	cmtapi "qing/r/api/pub/cmt_api"

	"github.com/go-chi/chi"
)

// Router ...
var Router = chi.NewRouter()

func init() {
	Router.Mount("/cmt", cmtapi.Router)
}
