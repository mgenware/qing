/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package discussionp

import "qing/app"

type DiscussionPageURLFormatter struct {
	ID uint64
}

func (formatter *DiscussionPageURLFormatter) GetURL(page int) string {
	return app.URL.DiscussionWithPage(formatter.ID, page)
}
