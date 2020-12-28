package forump

import "qing/app"

// ForumPageURLFormatter helps generate a forum page URL.
type ForumPageURLFormatter struct {
	ID  uint64
	Tab string
}

// NewForumPageURLFormatter creates a new ForumPageURLFormatter.
func NewForumPageURLFormatter(id uint64, tab string) *ForumPageURLFormatter {
	r := &ForumPageURLFormatter{ID: id, Tab: tab}
	return r
}

// GetURL returns the URL result.
func (formatter *ForumPageURLFormatter) GetURL(page int) string {
	return app.URL.ForumAdv(formatter.ID, formatter.Tab, page)
}