/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package mailx

import (
	"errors"
	"qing/a/conf"
	"qing/a/servicex/mailx/devmail"

	"github.com/wneessen/go-mail"
)

type MailService struct {
	config *conf.Config
	devDir string
}

func NewMailService(config *conf.Config) *MailService {
	res := &MailService{}
	res.config = config
	if config.Dev != nil && config.Dev.MailBox.Dir != "" {
		res.devDir = config.Dev.MailBox.Dir
	}
	return res
}

func (mn *MailService) SendMail(to, title, contentHTML string, noDevMail bool, siteName string) error {
	if to == "" {
		return errors.New("empty \"to\" field in `MailService.Send`")
	}
	// Write to file system in dev mode.
	if mn.devDir != "" && !noDevMail {
		err := devmail.SendMail(mn.devDir, to, title, contentHTML)
		if err != nil {
			return err
		}
		return nil
	}

	cfg := mn.config.Mail
	smtp := cfg.SMTP
	acc := cfg.NoReplyAccount

	msg := mail.NewMsg()
	if err := msg.FromFormat(siteName, acc.Email); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}
	msg.Subject(title)
	msg.SetBodyString(mail.TypeTextHTML, contentHTML)

	var sslOpt mail.Option
	if smtp.SSL {
		sslOpt = mail.WithSSL()
	}
	client, err := mail.NewClient(smtp.Host, mail.WithPort(smtp.Port), mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(acc.UserName), mail.WithPassword(acc.Pwd), sslOpt)
	if err != nil {
		return err
	}
	if err := client.DialAndSend(msg); err != nil {
		return err
	}
	return nil
}
