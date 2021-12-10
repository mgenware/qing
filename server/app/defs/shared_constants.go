/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
* This code was automatically generated by go-const-gen.
* Do not edit this file manually, your changes will be overwritten.
******************************************************************************************/

package defs

// SharedConstantsType ...
type SharedConstantsType struct {
	ColumnComments string
	ColumnCreated string
	ColumnLikes string
	ColumnMessages string
	CommunitySettingsKey string
	DownVoteValue int
	EntityAnswer int
	EntityCmt int
	EntityDiscussion int
	EntityDiscussionMsg int
	EntityForum int
	EntityForumDiscussion int
	EntityForumGroup int
	EntityForumQuestion int
	EntityPost int
	EntityQuestion int
	EntityReply int
	ErrAlreadyAdmin int
	ErrCannotSetAdminOfYourself int
	ErrCaptchaNotFound int
	ErrCaptchaNotMatch int
	ErrGeneric int
	ErrInvalidUserOrPwd int
	ErrNeedAuth int
	ErrPermissionDenied int
	ErrResourceNotFound int
	FormUploadMain string
	ForumStatusArchived int
	ForumStatusOpen int
	KeyAnswers string
	KeyCommunitySettings string
	KeyDiscussions string
	KeyLang string
	KeyPage string
	KeyPageSize string
	KeyPosts string
	KeyQuestions string
	KeyTab string
	KeyValue string
	MaxCaptchaLen int
	MaxEmailLen int
	MaxFileNameLen int
	MaxGenericStringLen int
	MaxNameLen int
	MaxPwdHashLen int
	MaxTitleLen int
	MaxUrlLen int
	MaxUserInfoFieldLen int
	MaxUserPwdLen int
	MinUserPwdLen int
	NoVoteValue int
	RouteApi string
	RouteAnswer string
	RouteAuth string
	RouteDevPage string
	RouteDiscussion string
	RouteForum string
	RouteForumGroup string
	RouteLang string
	RouteM string
	RouteMx string
	RoutePost string
	RouteQuestion string
	RouteUser string
	UpVoteValue int
}

// Shared ...
var Shared *SharedConstantsType

func init() {
	Shared = &SharedConstantsType{
		ColumnComments: "comments",
		ColumnCreated: "createdAt",
		ColumnLikes: "likes",
		ColumnMessages: "messages",
		CommunitySettingsKey: "community",
		DownVoteValue: -1,
		EntityAnswer: 7,
		EntityCmt: 2,
		EntityDiscussion: 4,
		EntityDiscussionMsg: 6,
		EntityForum: 10,
		EntityForumDiscussion: 8,
		EntityForumGroup: 11,
		EntityForumQuestion: 9,
		EntityPost: 1,
		EntityQuestion: 5,
		EntityReply: 3,
		ErrAlreadyAdmin: 2,
		ErrCannotSetAdminOfYourself: 1,
		ErrCaptchaNotFound: 10002,
		ErrCaptchaNotMatch: 10003,
		ErrGeneric: 10000,
		ErrInvalidUserOrPwd: 1,
		ErrNeedAuth: 10001,
		ErrPermissionDenied: 10004,
		ErrResourceNotFound: 10005,
		FormUploadMain: "main",
		ForumStatusArchived: 1,
		ForumStatusOpen: 0,
		KeyAnswers: "answers",
		KeyCommunitySettings: "communitySettings",
		KeyDiscussions: "discussions",
		KeyLang: "lang",
		KeyPage: "page",
		KeyPageSize: "pageSize",
		KeyPosts: "posts",
		KeyQuestions: "questions",
		KeyTab: "tab",
		KeyValue: "value",
		MaxCaptchaLen: 10,
		MaxEmailLen: 200,
		MaxFileNameLen: 255,
		MaxGenericStringLen: 100,
		MaxNameLen: 100,
		MaxPwdHashLen: 255,
		MaxTitleLen: 200,
		MaxUrlLen: 200,
		MaxUserInfoFieldLen: 100,
		MaxUserPwdLen: 30,
		MinUserPwdLen: 6,
		NoVoteValue: 0,
		RouteApi: "s",
		RouteAnswer: "a",
		RouteAuth: "auth",
		RouteDevPage: "__",
		RouteDiscussion: "d",
		RouteForum: "f",
		RouteForumGroup: "g",
		RouteLang: "lang",
		RouteM: "m",
		RouteMx: "mx",
		RoutePost: "p",
		RouteQuestion: "q",
		RouteUser: "u",
		UpVoteValue: 1,
	}
}
