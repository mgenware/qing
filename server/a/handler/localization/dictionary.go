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
	AutoLangOption            string `json:"autoLangOption"`
	CannotRemoveSelfAdmin     string `json:"cannotRemoveSelfAdmin"`
	ClickBelowToCompleteReg   string `json:"clickBelowToCompleteReg"`
	ClickBelowToResetPwd      string `json:"clickBelowToResetPwd"`
	ClickToViewItOn           string `json:"clickToViewItOn"`
	Copyright                 string `json:"copyright"`
	EmailVerified             string `json:"emailVerified"`
	ErrOccurred               string `json:"errOccurred"`
	InvalidNameOrPwd          string `json:"invalidNameOrPwd"`
	LinkExpired               string `json:"linkExpired"`
	NeedAuthErr               string `json:"needAuthErr"`
	NextPage                  string `json:"nextPage"`
	PFileSizeExceedsMaxSize   string `json:"pFileSizeExceedsMaxSize"`
	PermissionDenied          string `json:"permissionDenied"`
	PreviousPage              string `json:"previousPage"`
	QingSiteLink              string `json:"qingSiteLink"`
	QingSiteName              string `json:"qingSiteName"`
	RateLimitExceededErr      string `json:"rateLimitExceededErr"`
	ResNotFound               string `json:"resNotFound"`
	ResetPwdEmailTitle        string `json:"resetPwdEmailTitle"`
	ResetPwdSessionExpiredErr string `json:"resetPwdSessionExpiredErr"`
	SbRepliedToUrCmtIn        string `json:"sbRepliedToUrCmtIn"`
	SbRepliedToUrPost         string `json:"sbRepliedToUrPost"`
	SignIn                    string `json:"signIn"`
	ThisAccountIsPrivate      string `json:"thisAccountIsPrivate"`
	UnsupportedExtension      string `json:"unsupportedExtension"`
	VerifyYourEmailTitle      string `json:"verifyYourEmailTitle"`
	YouAreAlreadyAdmin        string `json:"youAreAlreadyAdmin"`
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
