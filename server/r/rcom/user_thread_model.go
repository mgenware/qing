/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import (
	"fmt"
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/da"
)

var vThreadPostView = appHandler.MainPage().MustParseView("/com/threads/postView.html")
var vThreadQuestionView = appHandler.MainPage().MustParseView("/com/threads/questionView.html")
var vThreadDiscussionView = appHandler.MainPage().MustParseView("/com/threads/discussionView.html")

// UserThreadModel is a data wrapper around PostTableSelectItemsForUserProfileResult.
type UserThreadModel struct {
	da.UserThreadInterface

	ThreadURL   string
	UserURL     string
	UserIconURL string
}

// NewUserThreadModel creates a new UserThreadModel.
func NewUserThreadModel(item *da.UserThreadInterface) (UserThreadModel, error) {
	d := UserThreadModel{UserThreadInterface: *item}
	switch item.ThreadType {
	case da.Constants.ThreadTypePost:
		d.ThreadURL = appURL.Get().Post(item.ID)
		break

	case da.Constants.ThreadTypeQuestion:
		d.ThreadURL = appURL.Get().Question(item.ID)
		break

	case da.Constants.ThreadTypeDiscussion:
		d.ThreadURL = appURL.Get().Discussion(item.ID)
		break

	default:
		return d, fmt.Errorf("Invalid item type %v", item.ThreadType)
	}
	uid := item.UserID
	d.UserURL = appURL.Get().UserProfile(uid)
	d.UserIconURL = appURL.Get().UserIconURL50(uid, item.UserIconName)
	return d, nil
}

// MustRunUserThreadViewTemplate runs an appropriate template associated with the given user thread model, and panics if any error happened.
func MustRunUserThreadViewTemplate(d *UserThreadModel) string {
	switch d.ThreadType {
	case da.Constants.ThreadTypePost:
		return vThreadPostView.MustExecuteToString(d)

	case da.Constants.ThreadTypeQuestion:
		return vThreadPostView.MustExecuteToString(d)

	case da.Constants.ThreadTypeDiscussion:
		return vThreadPostView.MustExecuteToString(d)

	default:
		panic(fmt.Errorf("Invalid item type %v", d.ThreadType))
	}
}
