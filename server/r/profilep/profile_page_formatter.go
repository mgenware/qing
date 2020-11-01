package profilep

import "qing/app"

type ProfilePageURLFormatter struct {
	ID uint64
}

func (formatter *ProfilePageURLFormatter) GetURL(page int) string {
	return app.URL.UserProfileWithPage(formatter.ID, page)
}
