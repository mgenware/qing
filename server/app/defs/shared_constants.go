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
	DefaultLang string
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
	ErrCaptchaNotFound int
	ErrCaptchaNotMatch int
	ErrGeneric int
	ErrInvalidUserOrPwd int
	ErrNeedAuth int
	ErrPermissionDenied int
	ForumStatusArchived int
	ForumStatusOpen int
	KeyAnswers string
	KeyDiscussions string
	KeyPage string
	KeyPageSize string
	KeyPosts string
	KeyQuestions string
	KeyTab string
	KeyValue string
	MaxCaptchaLen int
	MaxGenericStringLen int
	MaxUserPwdLen int
	MinUserPwdLen int
	RouteApi string
	RouteAuth string
	RouteDashboard string
	RouteDevPage string
	RouteDiscussion string
	RouteForum string
	RouteForumGroup string
	RoutePost string
	RouteQuestion string
	RouteUser string
}

// Shared ...
var Shared *SharedConstantsType

func init() {
	Shared = &SharedConstantsType{
		ColumnComments: "comments",
		ColumnCreated: "createdAt",
		ColumnLikes: "likes",
		ColumnMessages: "messages",
		DefaultLang: "en",
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
		ErrCaptchaNotFound: 10002,
		ErrCaptchaNotMatch: 10003,
		ErrGeneric: 10000,
		ErrInvalidUserOrPwd: 1,
		ErrNeedAuth: 10001,
		ErrPermissionDenied: 10004,
		ForumStatusArchived: 1,
		ForumStatusOpen: 0,
		KeyAnswers: "answers",
		KeyDiscussions: "discussions",
		KeyPage: "page",
		KeyPageSize: "pageSize",
		KeyPosts: "posts",
		KeyQuestions: "questions",
		KeyTab: "tab",
		KeyValue: "value",
		MaxCaptchaLen: 10,
		MaxGenericStringLen: 100,
		MaxUserPwdLen: 30,
		MinUserPwdLen: 6,
		RouteApi: "s",
		RouteAuth: "auth",
		RouteDashboard: "home",
		RouteDevPage: "__",
		RouteDiscussion: "d",
		RouteForum: "f",
		RouteForumGroup: "g",
		RoutePost: "p",
		RouteQuestion: "q",
		RouteUser: "user",
	}
}
