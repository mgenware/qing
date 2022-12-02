/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package notix

import (
	"fmt"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/servicex/mailx"
	"qing/da"
	"qing/lib/clib"

	strf "github.com/mgenware/go-string-format"
)

type Service struct {
	MailService *mailx.MailService
}

func NewNotiService(mailService *mailx.MailService) *Service {
	return &Service{MailService: mailService}
}

// `fromName` is only used for sending emails.
func (s *Service) SendNoti(noti *NotiItem, fromName string) error {
	db := appDB.Get().DB()
	// Determine user's language.
	lang, email, err := s.getUserLangAndEmail(noti.To)
	if err != nil {
		return err
	}

	// Generate noti email.
	ls := appHandler.MainPage().Dictionary(lang)
	mailData := DefaultTemplateData{}
	mailData.LinkText = strf.Format(globalThis.coreLS.ClickToViewItOn, globalThis.coreLS.QingSiteName)
	mailData.Link = noti.NavLink

	postTitle, err := clib.FetchEntityTitle(db, &noti.PostEntity)
	if err != nil {
		return err
	}

	switch noti.Action {
	case NotiActionToPost:
		mailData.Desc = strf.Format(globalThis.coreLS.SbRepliedToUrPost, fromName, postTitle)

	case NotiActionToCmt:
		mailData.Desc = strf.Format(globalThis.coreLS.SbRepliedToUrCmtIn, fromName, postTitle)

	default:
		return fmt.Errorf("unsupported action for noti %v", noti)
	}

	mailHTML, err := vDefaultTemplate.ExecuteToString(mailData)
	if err != nil {
		return err
	}
	_, err = s.MailService.Send(email, mailData.Desc, mailHTML)
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) getUserLangAndEmail(to uint64) (string, string, error) {
	res, err := da.User.SelectLangsAndEmail(appDB.Get().DB(), to)
	if err != nil {
		return "", "", err
	}
	if res.Lang != "" {
		return res.Lang, res.Email, nil
	}
	if res.RegLang == "" {
		return "", "", fmt.Errorf("unexpected empty regLang for user %v", to)
	}
	return res.RegLang, res.Email, nil
}
