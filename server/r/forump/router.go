package forump

import (
	"qing/app/handler"
)

// Router ...
var Router = handler.NewHTMLRouter()

func init() {
	// Authentication is performed at backend API level.
	Router.Get("/{fid}/settings", getForumSettings)
	Router.Get("/{fid}", getForum)
}
