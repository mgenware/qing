package rcom

import "qing/app"

var vNoContentView = app.MasterPageManager.MustParseView("/com/noContentView.html")

// MustRunNoContentViewTemplate executes vNoContentView to string, and panics if any error happened.
func MustRunNoContentViewTemplate() string {
	return vNoContentView.MustExecuteToString(nil)
}
