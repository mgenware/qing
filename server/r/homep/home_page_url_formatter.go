package homep

import "qing/app"

// HomePageURLFormatter helps generate a home page URL.
type HomePageURLFormatter struct {
	Tab string
}

// NewHomePageURLFormatter creates a HomePageURLFormatter.
func NewHomePageURLFormatter(tab string) *HomePageURLFormatter {
	r := &HomePageURLFormatter{Tab: tab}
	return r
}

// GetURL returns the URL result.
func (formatter *HomePageURLFormatter) GetURL(page int) string {
	return app.URL.HomeAdv(formatter.Tab, page)
}
