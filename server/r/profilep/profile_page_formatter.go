package profilep

import "qing/app"

type ProfilePageURLFormatter struct {
	ID  uint64
	Tab string
}

func (formatter *ProfilePageURLFormatter) GetURL(page int) string {
	return app.URL.UserProfileAdv(formatter.ID, formatter.Tab, page)
}
