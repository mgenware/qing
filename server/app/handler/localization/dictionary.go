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
	HtmlLang               string `json:"_htmlLang"`
	Lang                   string `json:"_lang"`
	SiteName               string `json:"_siteName"`
	AboutMe                string `json:"aboutMe"`
	Bio                    string `json:"bio"`
	Cancel                 string `json:"cancel"`
	CaptNotFoundErr        string `json:"captNotFoundErr"`
	CaptNotMatch           string `json:"captNotMatch"`
	Captcha                string `json:"captcha"`
	ChooseAFileBtn         string `json:"chooseAFileBtn"`
	ClickToRefreshCapt     string `json:"clickToRefreshCapt"`
	Comment                string `json:"comment"`
	Comments               string `json:"comments"`
	Company                string `json:"company"`
	ConfirmPassword        string `json:"confirmPassword"`
	Content                string `json:"content"`
	Copyright              string `json:"copyright"`
	CreateAnAcc            string `json:"createAnAcc"`
	DateCreated            string `json:"dateCreated"`
	DateModified           string `json:"dateModified"`
	Delete                 string `json:"delete"`
	Edit                   string `json:"edit"`
	EditComment            string `json:"editComment"`
	EditPost               string `json:"editPost"`
	EditProfile            string `json:"editProfile"`
	EditedAt               string `json:"editedAt"`
	Email                  string `json:"email"`
	EnterCaptchaPlz        string `json:"enterCaptchaPlz"`
	ErrOccurred            string `json:"errOccurred"`
	Error                  string `json:"error"`
	ErrorCode              string `json:"errorCode"`
	Exceed5MbErr           string `json:"exceed5MBErr"`
	GoToPage               string `json:"goToPage"`
	GoToYourEmail          string `json:"goToYourEmail"`
	Home                   string `json:"home"`
	InternalErr            string `json:"internalErr"`
	InvalidPageNumber      string `json:"invalidPageNumber"`
	Likes                  string `json:"likes"`
	Loading                string `json:"loading"`
	Location               string `json:"location"`
	Msgs                   string `json:"msgs"`
	Name                   string `json:"name"`
	NeedAuthErr            string `json:"needAuthErr"`
	NewPost                string `json:"newPost"`
	NewQuestion            string `json:"newQuestion"`
	NewThread              string `json:"newThread"`
	NextPage               string `json:"nextPage"`
	No                     string `json:"no"`
	NoComment              string `json:"noComment"`
	NoContentAvailable     string `json:"noContentAvailable"`
	NumOfMsgs              string `json:"numOfMsgs"`
	Ok                     string `json:"ok"`
	OneItem                string `json:"oneItem"`
	PDoYouWantToDeleteThis string `json:"pDoYouWantToDeleteThis"`
	PNoComments            string `json:"pNOComments"`
	PNoReplies             string `json:"pNOReplies"`
	PPageNotFound          string `json:"pPageNotFound"`
	PPlzEnterThe           string `json:"pPlzEnterThe"`
	PReplyTo               string `json:"pReplyTo"`
	PReplyingTo            string `json:"pReplyingTo"`
	PView                  string `json:"pView"`
	PViewMore              string `json:"pViewMore"`
	PageControlItemFormat  string `json:"pageControlItemFormat"`
	PageControlPageFormat  string `json:"pageControlPageFormat"`
	PageNumberOutOfBounds  string `json:"pageNumberOutOfBounds"`
	Password               string `json:"password"`
	PlsLoginToComment      string `json:"plsLoginToComment"`
	Post                   string `json:"post"`
	PostAMsgToThisThread   string `json:"postAMsgToThisThread"`
	Posts                  string `json:"posts"`
	PpItemsCounter         string `json:"ppItemsCounter"`
	PreviousPage           string `json:"previousPage"`
	Profile                string `json:"profile"`
	ProfilePicture         string `json:"profilePicture"`
	ProfileUpdated         string `json:"profileUpdated"`
	Publish                string `json:"publish"`
	Publishing             string `json:"publishing"`
	PwdDontMatch           string `json:"pwdDontMatch"`
	RegEmailSentContent    string `json:"regEmailSentContent"`
	RegEmailSentTitle      string `json:"regEmailSentTitle"`
	RegEmailVeriExpired    string `json:"regEmailVeriExpired"`
	Replies                string `json:"replies"`
	Reply                  string `json:"reply"`
	Request                string `json:"request"`
	Reset                  string `json:"reset"`
	ResourceNotFound       string `json:"resourceNotFound"`
	Retry                  string `json:"retry"`
	RysDiscardChanges      string `json:"rysDiscardChanges"`
	Save                   string `json:"save"`
	Saved                  string `json:"saved"`
	Saving                 string `json:"saving"`
	Send                   string `json:"send"`
	Settings               string `json:"settings"`
	SignIn                 string `json:"signIn"`
	SignOut                string `json:"signOut"`
	SignUp                 string `json:"signUp"`
	ThemeDark              string `json:"themeDark"`
	ThemeLight             string `json:"themeLight"`
	Threads                string `json:"threads"`
	Title                  string `json:"title"`
	UnsavedChangesWarning  string `json:"unsavedChangesWarning"`
	UnsupportedImgExtErr   string `json:"unsupportedImgExtErr"`
	UploadProfileImgDesc   string `json:"uploadProfileImgDesc"`
	Uploading              string `json:"uploading"`
	Url                    string `json:"url"`
	Warning                string `json:"warning"`
	Working                string `json:"working"`
	WriteAComment          string `json:"writeAComment"`
	Yes                    string `json:"yes"`
	YourPosts              string `json:"yourPosts"`
	YourQuestions          string `json:"yourQuestions"`
	YourThreads            string `json:"yourThreads"`
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
