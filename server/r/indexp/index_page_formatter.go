package indexp

import "qing/app"

type IndexPageURLFormatter struct {
	Tab int
}

func (formatter *IndexPageURLFormatter) GetURL(page int) string {
	return app.URL.IndexAdv(formatter.Tab, page)
}
