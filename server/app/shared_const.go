/******************************************************************************************
* This code was automatically generated by go-const-gen.
* Do not edit this file manually, your changes will be overwritten.
******************************************************************************************/

package app

// SharedConstants ...
type SharedConstants struct {
	ColumnComments        string `json:"columnComments"`
	ColumnCreated         string `json:"columnCreated"`
	ColumnLikes           string `json:"columnLikes"`
	ErrInvalidUserOrPwd   int    `json:"errInvalidUserOrPwd"`
	ForumPostTypePost     int    `json:"forumPostTypePost"`
	ForumPostTypeQuestion int    `json:"forumPostTypeQuestion"`
	MaxGenericStringLen   int    `json:"maxGenericStringLen"`
	MaxPostTitleLen       int    `json:"maxPostTitleLen"`
	MaxUserEmailLen       int    `json:"maxUserEmailLen"`
	MaxUserNameLen        int    `json:"maxUserNameLen"`
	MaxUserPwdLen         int    `json:"maxUserPwdLen"`
	MinUserPwdLen         int    `json:"minUserPwdLen"`
	PostDestinationForum  int    `json:"postDestinationForum"`
	PostDestinationUser   int    `json:"postDestinationUser"`
}

// Constants ...
var Constants *SharedConstants

func init() {
	Constants = &SharedConstants{
		ColumnComments:        "comments",
		ColumnCreated:         "createdAt",
		ColumnLikes:           "likes",
		ErrInvalidUserOrPwd:   1,
		ForumPostTypePost:     0,
		ForumPostTypeQuestion: 1,
		MaxGenericStringLen:   100,
		MaxPostTitleLen:       200,
		MaxUserEmailLen:       200,
		MaxUserNameLen:        200,
		MaxUserPwdLen:         30,
		MinUserPwdLen:         6,
		PostDestinationForum:  1,
		PostDestinationUser:   0,
	}
}
