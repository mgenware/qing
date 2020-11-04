/******************************************************************************************
* This code was automatically generated by go-const-gen.
* Do not edit this file manually, your changes will be overwritten.
******************************************************************************************/

package defs

// SharedConstants ...
type SharedConstants struct {
	ColumnComments       string
	ColumnCreated        string
	ColumnLikes          string
	DefaultLang          string
	EntityCmt            int
	EntityPost           int
	EntityQuestion       int
	EntityReply          int
	EntityThread         int
	ErrCaptchaNotFound   int
	ErrCaptchaNotMatch   int
	ErrGeneric           int
	ErrInvalidUserOrPwd  int
	ErrNeedAuth          int
	MaxGenericStringLen  int
	MaxPostTitleLen      int
	MaxUserEmailLen      int
	MaxUserNameLen       int
	MaxUserPwdLen        int
	MinUserPwdLen        int
	PostDestinationForum int
	PostDestinationUser  int
	RouteApi             string
	RouteAuth            string
	RouteDashboard       string
	RouteForum           string
	RoutePost            string
	RouteTest            string
	RouteThread          string
	RouteUser            string
}

// Constants ...
var Constants *SharedConstants

func init() {
	Constants = &SharedConstants{
		ColumnComments:       "comments",
		ColumnCreated:        "createdAt",
		ColumnLikes:          "likes",
		DefaultLang:          "en",
		EntityCmt:            2,
		EntityPost:           1,
		EntityQuestion:       5,
		EntityReply:          3,
		EntityThread:         4,
		ErrCaptchaNotFound:   10002,
		ErrCaptchaNotMatch:   10003,
		ErrGeneric:           10000,
		ErrInvalidUserOrPwd:  1,
		ErrNeedAuth:          10001,
		MaxGenericStringLen:  100,
		MaxPostTitleLen:      200,
		MaxUserEmailLen:      200,
		MaxUserNameLen:       200,
		MaxUserPwdLen:        30,
		MinUserPwdLen:        6,
		PostDestinationForum: 2,
		PostDestinationUser:  1,
		RouteApi:             "s",
		RouteAuth:            "auth",
		RouteDashboard:       "home",
		RouteForum:           "f",
		RoutePost:            "p",
		RouteTest:            "test",
		RouteThread:          "t",
		RouteUser:            "user",
	}
}