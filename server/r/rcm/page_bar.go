package rcm

import (
	"qing/app"
)

var vPageBar = app.TemplateManager.MustParseView("/cm/pageBar.html")

// GetPageBarHTML returns page bar HTML with the given params.
func GetPageBarHTML(pageData *PageData) string {
	return vPageBar.MustExecuteToString(pageData)
}
