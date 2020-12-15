package forumapi

import (
	"qing/app/handler"
	fgmodapi "qing/r/api/pri/forum_api/fgmod_api"
	fmodapi "qing/r/api/pri/forum_api/fmod_api"
)

// Router ...
var Router = handler.NewJSONRouter()

func init() {
	Router.Mount("/fgmod", fgmodapi.Router)
	Router.Mount("/fmod", fmodapi.Router)
}
