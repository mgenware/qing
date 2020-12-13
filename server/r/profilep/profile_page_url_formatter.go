package profilep

import "qing/app"

// ProfilePageURLFormatter helps generate a profile page URL.
type ProfilePageURLFormatter struct {
	ID  uint64
	Tab string
}

// NewProfilePageURLFormatter creates a ProfilePageURLFormatter.
func NewProfilePageURLFormatter(id uint64, tab string) *ProfilePageURLFormatter {
	r := &ProfilePageURLFormatter{ID: id, Tab: tab}
	return r
}

// GetURL returns the URL result.
func (formatter *ProfilePageURLFormatter) GetURL(page int) string {
	return app.URL.UserProfileAdv(formatter.ID, formatter.Tab, page)
}
