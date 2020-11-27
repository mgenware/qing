package discussionp

import "qing/app"

type DiscussionPageURLFormatter struct {
	ID uint64
}

func (formatter *DiscussionPageURLFormatter) GetURL(page int) string {
	return app.URL.DiscussionWithPage(formatter.ID, page)
}
