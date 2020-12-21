package handler

// MasterPageData holds the data needed in main page template.
type MasterPageData struct {
	Title       string
	ContentHTML string
	Header      string
	Scripts     string

	// Additional fields
	AppUserID      string
	AppUserName    string
	AppUserURL     string
	AppUserIconURL string
	AppUserAdmin   bool
	AppLang        string
	// HTML-complaint version of `AppLang`.
	AppHTMLLang   string
	AppForumsMode bool
}

// NewMasterPageData creates a new MasterPageData.
func NewMasterPageData(title, contentHTML string) *MasterPageData {
	return &MasterPageData{Title: title, ContentHTML: contentHTML}
}
