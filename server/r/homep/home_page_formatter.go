package homep

import "qing/app"

type HomePageURLFormatter struct {
	Tab string
}

func (formatter *HomePageURLFormatter) GetURL(page int) string {
	return app.URL.HomeAdv(formatter.Tab, page)
}
