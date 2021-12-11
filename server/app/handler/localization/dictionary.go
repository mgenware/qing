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

package localization

import (
	"encoding/json"
	"io/ioutil"
)

// Dictionary ...
type Dictionary struct {
	Lang                              string `json:"_lang"`
	SiteName                          string `json:"_siteName"`
	AboutMe                           string `json:"aboutMe"`
	Actions                           string `json:"actions"`
	Add                               string `json:"add"`
	AddAnAdmin                        string `json:"addAnAdmin"`
	AdminAccounts                     string `json:"adminAccounts"`
	AllThreads                        string `json:"allThreads"`
	Answer                            string `json:"answer"`
	Answers                           string `json:"answers"`
	Bio                               string `json:"bio"`
	Blockquote                        string `json:"blockquote"`
	Bold                              string `json:"bold"`
	BulletList                        string `json:"bulletList"`
	Cancel                            string `json:"cancel"`
	CaptNotFoundErr                   string `json:"captNotFoundErr"`
	CaptNotMatch                      string `json:"captNotMatch"`
	Captcha                           string `json:"captcha"`
	ChooseAFileBtn                    string `json:"chooseAFileBtn"`
	ClickToRefreshCapt                string `json:"clickToRefreshCapt"`
	Close                             string `json:"close"`
	Code                              string `json:"code"`
	Comment                           string `json:"comment"`
	Comments                          string `json:"comments"`
	CommunitySettingsName             string `json:"communitySettingsName"`
	Company                           string `json:"company"`
	ConfirmAddUserAsAdmin             string `json:"confirmAddUserAsAdmin"`
	ConfirmPassword                   string `json:"confirmPassword"`
	Content                           string `json:"content"`
	Copied                            string `json:"copied"`
	Copy                              string `json:"copy"`
	Copyright                         string `json:"copyright"`
	CreateAnAcc                       string `json:"createAnAcc"`
	DateCreated                       string `json:"dateCreated"`
	DateModified                      string `json:"dateModified"`
	DecreaseIndent                    string `json:"decreaseIndent"`
	Delete                            string `json:"delete"`
	Description                       string `json:"description"`
	Discussion                        string `json:"discussion"`
	Discussions                       string `json:"discussions"`
	DoYouWantDoDiscardYourChanges     string `json:"doYouWantDoDiscardYourChanges"`
	DoYouWantToChangeLangTo           string `json:"doYouWantToChangeLangTo"`
	Downvote                          string `json:"downvote"`
	Edit                              string `json:"edit"`
	EditComment                       string `json:"editComment"`
	EditedAt                          string `json:"editedAt"`
	Email                             string `json:"email"`
	EnableForumGroups                 string `json:"enableForumGroups"`
	EnableForums                      string `json:"enableForums"`
	EnableQueAndDis                   string `json:"enableQueAndDis"`
	EnterCaptchaPlz                   string `json:"enterCaptchaPlz"`
	ErrOccurred                       string `json:"errOccurred"`
	Error                             string `json:"error"`
	ErrorCode                         string `json:"errorCode"`
	Exceed5MbErr                      string `json:"exceed5MBErr"`
	FeatureOnlyAvailableToAdmins      string `json:"featureOnlyAvailableToAdmins"`
	FindUsersByColon                  string `json:"findUsersByColon"`
	Forums                            string `json:"forums"`
	General                           string `json:"general"`
	GoToMyAnswer                      string `json:"goToMyAnswer"`
	GoToPage                          string `json:"goToPage"`
	GoToYourEmail                     string `json:"goToYourEmail"`
	Home                              string `json:"home"`
	HorizontalRule                    string `json:"horizontalRule"`
	InternalErr                       string `json:"internalErr"`
	InvalidPageNumber                 string `json:"invalidPageNumber"`
	Italic                            string `json:"italic"`
	LangSettings                      string `json:"langSettings"`
	Likes                             string `json:"likes"`
	Link                              string `json:"link"`
	Loading                           string `json:"loading"`
	Location                          string `json:"location"`
	Moderators                        string `json:"moderators"`
	Msgs                              string `json:"msgs"`
	Name                              string `json:"name"`
	NeedAuthErr                       string `json:"needAuthErr"`
	NewDiscussion                     string `json:"newDiscussion"`
	NewPost                           string `json:"newPost"`
	NewQuestion                       string `json:"newQuestion"`
	NewThread                         string `json:"newThread"`
	NextPage                          string `json:"nextPage"`
	No                                string `json:"no"`
	NoAnswers                         string `json:"noAnswers"`
	NoComments                        string `json:"noComments"`
	NoContentAvailable                string `json:"noContentAvailable"`
	NoResultsFound                    string `json:"noResultsFound"`
	NumOfMsgs                         string `json:"numOfMsgs"`
	NumOfThreads                      string `json:"numOfThreads"`
	NumberedList                      string `json:"numberedList"`
	Ok                                string `json:"ok"`
	OneItem                           string `json:"oneItem"`
	PDoYouWantToDeleteThis            string `json:"pDoYouWantToDeleteThis"`
	PEditEntity                       string `json:"pEditEntity"`
	PNoComments                       string `json:"pNOComments"`
	PNoReplies                        string `json:"pNOReplies"`
	PPageNotFound                     string `json:"pPageNotFound"`
	PPlzEnterThe                      string `json:"pPlzEnterThe"`
	PReplyTo                          string `json:"pReplyTo"`
	PView                             string `json:"pView"`
	PViewMore                         string `json:"pViewMore"`
	PageControlItemFormat             string `json:"pageControlItemFormat"`
	PageControlPageFormat             string `json:"pageControlPageFormat"`
	PageNumberOutOfBounds             string `json:"pageNumberOutOfBounds"`
	Password                          string `json:"password"`
	PlsLoginToAddYourAnswer           string `json:"plsLoginToAddYourAnswer"`
	PlsLoginToComment                 string `json:"plsLoginToComment"`
	Post                              string `json:"post"`
	PostAMsgToThisDiscussion          string `json:"postAMsgToThisDiscussion"`
	PostAnAnswer                      string `json:"postAnAnswer"`
	Posts                             string `json:"posts"`
	PpItemsCounter                    string `json:"ppItemsCounter"`
	PreviousPage                      string `json:"previousPage"`
	Profile                           string `json:"profile"`
	ProfilePicture                    string `json:"profilePicture"`
	ProfileUpdated                    string `json:"profileUpdated"`
	Publish                           string `json:"publish"`
	Publishing                        string `json:"publishing"`
	PwdDontMatch                      string `json:"pwdDontMatch"`
	Question                          string `json:"question"`
	Questions                         string `json:"questions"`
	Redo                              string `json:"redo"`
	RegEmailSentContent               string `json:"regEmailSentContent"`
	RegEmailSentTitle                 string `json:"regEmailSentTitle"`
	RegEmailVeriExpired               string `json:"regEmailVeriExpired"`
	RemoveAdmin                       string `json:"removeAdmin"`
	RemoveAdminConfirmation           string `json:"removeAdminConfirmation"`
	Replies                           string `json:"replies"`
	Reply                             string `json:"reply"`
	Request                           string `json:"request"`
	Reset                             string `json:"reset"`
	ResourceNotFound                  string `json:"resourceNotFound"`
	RestartServerToTakeEffect         string `json:"restartServerToTakeEffect"`
	Retry                             string `json:"retry"`
	RysDiscardChanges                 string `json:"rysDiscardChanges"`
	Save                              string `json:"save"`
	Saved                             string `json:"saved"`
	Saving                            string `json:"saving"`
	Send                              string `json:"send"`
	Settings                          string `json:"settings"`
	SignIn                            string `json:"signIn"`
	SignInToLikeThisEntity            string `json:"signInToLikeThisEntity"`
	SignInToVoteThisAnswer            string `json:"signInToVoteThisAnswer"`
	SignOut                           string `json:"signOut"`
	SignUp                            string `json:"signUp"`
	SiteSettings                      string `json:"siteSettings"`
	Strikethrough                     string `json:"strikethrough"`
	ThemeDark                         string `json:"themeDark"`
	ThemeLight                        string `json:"themeLight"`
	ThisIsYou                         string `json:"thisIsYou"`
	Title                             string `json:"title"`
	Underline                         string `json:"underline"`
	Undo                              string `json:"undo"`
	UnsupportedImgExtErr              string `json:"unsupportedImgExtErr"`
	UploadProfileImgDesc              string `json:"uploadProfileImgDesc"`
	Uploading                         string `json:"uploading"`
	Upvote                            string `json:"upvote"`
	Url                               string `json:"url"`
	UserId                            string `json:"userID"`
	UserIsAlreadyAdmin                string `json:"userIsAlreadyAdmin"`
	Warning                           string `json:"warning"`
	Working                           string `json:"working"`
	WriteAComment                     string `json:"writeAComment"`
	Yes                               string `json:"yes"`
	YouCannotChangeYourOwnAdminStatus string `json:"youCannotChangeYourOwnAdminStatus"`
	YouHaveNotSavedYourChanges        string `json:"youHaveNotSavedYourChanges"`
	YourDiscussions                   string `json:"yourDiscussions"`
	YourPosts                         string `json:"yourPosts"`
	YourQuestions                     string `json:"yourQuestions"`
}

// ParseDictionary loads a Dictionary from a JSON file.
func ParseDictionary(file string) (*Dictionary, error) {
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	var data Dictionary
	err = json.Unmarshal(bytes, &data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}
