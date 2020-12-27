package handler

// MasterPageData holds the data needed in main page template.
type MasterPageData struct {
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

// This wraps a MasterPageData and is used internally by template manager.
type masterPageDataWrapper struct {
}

// NewMasterPageData creates a new MasterPageData.
func NewMasterPageData(title, contentHTML string) *MasterPageData {
	return &MasterPageData{Title: title, ContentHTML: contentHTML}
}
