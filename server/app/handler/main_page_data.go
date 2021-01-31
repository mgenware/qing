package handler

// MainPageData holds the data needed in main page template.
type MainPageData struct {
	// User properties.
	Title       string
	ContentHTML string
	Header      string
	Scripts     string
	WindData    interface{}

	// HTML-complaint version of `AppLang`.
	AppHTMLLang string

	// Additional fields set in script area.
	AppUserID         string
	AppUserName       string
	AppUserURL        string
	AppUserIconURL    string
	AppUserAdmin      bool
	AppLang           string
	AppForumsMode     bool
	AppWindDataString string
}

// This wraps a MainPageData and is used internally by template manager.
type MainPageDataWrapper struct {
}

// NewMainPageData creates a new MainPageData.
func NewMainPageData(title, contentHTML string) *MainPageData {
	return &MainPageData{Title: title, ContentHTML: contentHTML}
}
