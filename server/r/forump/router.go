package forump

import (
	"qing/app/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	Router.Get("/{fid}", getForum)
}
