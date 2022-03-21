/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /******************************************************************************************
* This code was automatically generated by `@qing/def`.
* Do not edit this file manually, your changes will be overwritten.
******************************************************************************************/package appdef

const MinUserPwdLen = 6
const MaxUserPwdLen = 30
const MaxCaptchaLen = 10
const MaxGenericStringLen = 100
const ErrInvalidUserOrPwd = 1
const ErrCannotSetAdminOfYourself = 1
const ErrAlreadyAdmin = 2
const ColumnCreated = "createdAt"
const ColumnLikes = "likes"
const ColumnComments = "comments"
const ColumnMessages = "messages"
const RouteUser = "u"
const RoutePost = "p"
const RouteAuth = "auth"
const RouteDevPage = "__"
const RouteM = "m"
const RouteMX = "mx"
const RouteAPI = "s"
const RouteForum = "f"
const RouteDiscussion = "d"
const RouteForumGroup = "g"
const RouteQuestion = "q"
const RouteAnswer = "a"
const RouteLang = "lang"
const ErrGeneric = 10000
const ErrNeedAuth = 10001
const ErrCaptchaNotFound = 10002
const ErrCaptchaNotMatch = 10003
const ErrPermissionDenied = 10004
const ErrResourceNotFound = 10005
const KeyPosts = "posts"
const KeyDiscussions = "discussions"
const KeyAnswers = "answers"
const KeyPage = "page"
const KeyPageSize = "pageSize"
const KeyTab = "tab"
const KeyValue = "value"
const KeyQuestions = "questions"
const KeyCommunitySettings = "communitySettings"
const KeyLang = "lang"
const ForumStatusOpen = 0
const ForumStatusArchived = 1
const UpVoteValue = 1
const DownVoteValue = -1
const NoVoteValue = 0
const MaxTitleLen = 200
const MaxEmailLen = 200
const MaxNameLen = 100
const MaxFileNameLen = 255
const MaxUserInfoFieldLen = 100
const MaxURLLen = 200
const MaxPwdHashLen = 255
const FormUploadMain = "main"
const DeleteFlagAuthor = 1
const DeleteFlagHost = 2

type ContentBaseType int

const (
	ContentBaseTypePost ContentBaseType = iota + 1
	ContentBaseTypeCmt
	ContentBaseTypeDis
	ContentBaseTypeAns
)

type HomePageFeedType int

const (
	HomePageFeedTypePost HomePageFeedType = iota + 1
	HomePageFeedTypeThread
)
