package rcom

import "qing/app"

// VNoContentView displays "No content available" in a div.
var VNoContentView = app.MasterPageManager.MustParseView("/com/noContentView.html")

// VThreadPostView ...
var VThreadPostView = app.MasterPageManager.MustParseView("/com/threads/postView.html")

// VThreadQuestionView ...
var VThreadQuestionView = app.MasterPageManager.MustParseView("/com/threads/questionView.html")

// VThreadDiscussionView ...
var VThreadDiscussionView = app.MasterPageManager.MustParseView("/com/threads/discussionView.html")
