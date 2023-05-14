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
const LenMaxTitle = 200
const LenMaxEmail = 200
const LenMaxName = 100
const LenMaxFileName = 255
const LenMaxUserInfoField = 100
const LenMaxURL = 200
const LenMaxPwdHash = 255
const LenMinUserPwd = 6
const LenMaxUserPwd = 30
const LenMaxCaptcha = 10
const LenMaxLang = 10
const LenMaxGenericString = 100
const LenMaxPostSummary = 300
const KeyPosts = "posts"
const KeyReplies = "replies"
const KeyPage = "page"
const KeyPageSize = "pageSize"
const KeyTab = "tab"
const KeyValue = "value"
const KeyForumPosts = "forumPosts"
const KeyCreated = "createdAt"
const KeyLikes = "likes"
const KeyComments = "comments"
const KeyMessages = "messages"
const KeyLang = "lang"
const KeyCmt = "cmt"
const RouteM = "m"
const RouteMx = "mx"
const RouteApi = "s"
const RouteForum = "f"
const RouteForumGroup = "g"
const RouteForumPost = "t"
const RouteDev = "__"
const RouteAuth = "auth"
const RoutePost = "p"
const RouteUser = "u"
const BrHomePrefixOnlyMe = "__br_home_onlyme"
const BrHomePrefixEveryone = "__br_home_everyone"

type PostPermission int

const (
	PostPermissionOnlyMe PostPermission = iota + 1
	PostPermissionEveryone
)

type ContentBaseType int

const (
	ContentBaseTypePost ContentBaseType = iota + 1
	ContentBaseTypeCmt
	ContentBaseTypeFPost
)

type ContentInputType int

const (
	ContentInputTypeStandard ContentInputType = iota + 1
	ContentInputTypeMarkdown
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

type GetSiteSettings int

const (
	GetSiteSettingsGeneral GetSiteSettings = iota + 1
	GetSiteSettingsLangs
)

type SetSiteSettings int

const (
	SetSiteSettingsInfo SetSiteSettings = iota + 1
	SetSiteSettingsLangs
	SetSiteSettingsPostPermission
)
