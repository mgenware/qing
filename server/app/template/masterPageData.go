package template

// MasterPageData holds the data needed in main page template.
type MasterPageData struct {
	LocalizedTemplateData

	Title       string
	ContentHTML string
	Header      string
	Scripts     string
}

// NewMasterPageData creates a new MasterPageData.
func NewMasterPageData(title, contentHTML string) *MasterPageData {
	return &MasterPageData{Title: title, ContentHTML: contentHTML}
}
