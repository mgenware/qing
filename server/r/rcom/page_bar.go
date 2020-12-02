package rcom

import (
	"qing/app"
)

var vPageBar = app.MasterPageManager.MustParseView("/cm/pageBar.html")

// GetPageBarHTML returns page bar HTML with the given params.
func GetPageBarHTML(pageData *PageData) string {
	return vPageBar.MustExecuteToString(pageData)
}
