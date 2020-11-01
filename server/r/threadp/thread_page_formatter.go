package threadp

import "qing/app"

type ThreadPageURLFormatter struct {
	ID uint64
}

func (formatter *ThreadPageURLFormatter) GetURL(page int) string {
	return app.URL.ThreadWithPage(formatter.ID, page)
}
