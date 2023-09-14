/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mailx

import (
	"errors"
	"qing/a/appConfig"
	"qing/a/cfgx"
	"qing/a/servicex/mailx/devmail"

	"github.com/wneessen/go-mail"
)

type MailService struct {
	cfg    *cfgx.CoreConfig
	devDir string
}

func NewMailService(cc *cfgx.CoreConfig) *MailService {
	res := &MailService{}
	res.cfg = cc
	if cc.Dev != nil && cc.Dev.MailBox.Dir != "" {
		res.devDir = cc.Dev.MailBox.Dir
	}
	return res
}

func (mn *MailService) SendMail(ac appConfig.AppConfigAccessorBase, to, title, contentHTML string, realMail bool, siteName string) error {
	if to == "" {
		return errors.New("empty \"to\" field in `MailService.Send`")
	}
	// Write to file system in dev mode.
	if mn.devDir != "" && !realMail {
		err := devmail.SendMail(mn.devDir, to, title, contentHTML)
		if err != nil {
			return err
		}
		return nil
	}

	msg := mail.NewMsg()
	if err := msg.FromFormat(siteName, ac.NotiMailAccount()); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}
	msg.Subject(title)
	msg.SetBodyString(mail.TypeTextHTML, contentHTML)

	var sslOpt mail.Option
	if ac.NotiMailSmtpUseTLS() {
		sslOpt = mail.WithSSL()
	}
	client, err := mail.NewClient(ac.NotiMailSmtpHost(), mail.WithPort(ac.NotiMailSmtpPort()), mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(ac.NotiMailUserName()), mail.WithPassword(ac.NotiMailPassword()), sslOpt)
	if err != nil {
		return err
	}
	if err := client.DialAndSend(msg); err != nil {
		return err
	}
	return nil
}
