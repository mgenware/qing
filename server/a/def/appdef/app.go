/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /******************************************************************************************
* This code was automatically generated by `@qing/def`.
* Do not edit this file manually, your changes will be overwritten.
******************************************************************************************/

package appdef

const ForumStatusOpen = 0
const ForumStatusArchived = 1
const FormUploadMain = "main"
const DeleteFlagSelf = 1
const DeleteFlagHost = 2
const ApiLangParam = "__l"
const ErrGeneric = 1

type SiteType int

const (
	SiteTypeBlog SiteType = iota + 1
	SiteTypeCommunity
	SiteTypeForums
)

type ContentBaseType int

const (
	ContentBaseTypePost ContentBaseType = iota + 1
	ContentBaseTypeCmt
	ContentBaseTypeFPost
)

type HomePageFeedType int

const (
	HomePageFeedTypePost HomePageFeedType = iota + 1
	HomePageFeedTypeFPost
)

type DelFlags int

const (
	DelFlagsSelf DelFlags = iota + 1
	DelFlagsHost
)

type SiteSettings int

const (
	SiteSettingsCore SiteSettings = iota + 1
)

const (
	RouteM = "m"
	RouteMx = "mx"
	RouteApi = "s"
	RouteForum = "f"
	RouteForumGroup = "g"
	RouteForumPost = "t"
	RouteDev = "__"
	RouteAuth = "auth"
	RoutePost = "p"
	RouteUser = "u"
)

const (
	KeyPosts = "posts"
	KeyReplies = "replies"
	KeyPage = "page"
	KeyPageSize = "pageSize"
	KeyTab = "tab"
	KeyValue = "value"
	KeyForumPosts = "forumPosts"
	KeyCreated = "createdAt"
	KeyLikes = "likes"
	KeyComments = "comments"
	KeyMessages = "messages"
	KeyLang = "lang"
	KeyCmt = "cmt"
)

const (
	LenMaxTitle = 200
	LenMaxEmail = 200
	LenMaxName = 100
	LenMaxFileName = 255
	LenMaxUserInfoField = 100
	LenMaxURL = 200
	LenMaxPwdHash = 255
	LenMinUserPwd = 6
	LenMaxUserPwd = 30
	LenMaxCaptcha = 10
	LenMaxLang = 10
	LenMaxGenericString = 100
)
