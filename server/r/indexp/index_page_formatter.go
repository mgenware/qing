package indexp

import "qing/app"

type IndexPageURLFormatter struct {
	Tab string
}

func (formatter *IndexPageURLFormatter) GetURL(page int) string {
	return app.URL.IndexAdv(formatter.Tab, page)
}
