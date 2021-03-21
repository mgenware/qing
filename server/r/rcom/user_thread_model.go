/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package rcom

import (
	"fmt"
	"qing/app"
	"qing/da"
)

var vThreadPostView = app.MainPageManager.MustParseView("/com/threads/postView.html")
var vThreadQuestionView = app.MainPageManager.MustParseView("/com/threads/questionView.html")
var vThreadDiscussionView = app.MainPageManager.MustParseView("/com/threads/discussionView.html")

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
		d.ThreadURL = app.URL.Post(item.ID)
		break

	case da.Constants.ThreadTypeQuestion:
		d.ThreadURL = app.URL.Question(item.ID)
		break

	case da.Constants.ThreadTypeDiscussion:
		d.ThreadURL = app.URL.Discussion(item.ID)
		break

	default:
		return d, fmt.Errorf("Invalid item type %v", item.ThreadType)
	}
	uid := item.UserID
	d.UserURL = app.URL.UserProfile(uid)
	d.UserIconURL = app.URL.UserIconURL50(uid, item.UserIconName)
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
