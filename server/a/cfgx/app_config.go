/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cfgx

import (
	"encoding/json"
	"qing/a/cfgx/appcfg"
)

type AppConfig struct {
	// Specifies another file which this file extends from.
	Extends string `json:"extends,omitempty"`

	Permissions *appcfg.PermissionsConfig `json:"permissions,omitempty"`
	Content     *appcfg.ContentConfig     `json:"content,omitempty"`
	Mail        *appcfg.MailConfig        `json:"mail,omitempty"`
	Forum       *appcfg.ForumConfig       `json:"forum,omitempty"`
}

func (c *AppConfig) GetExtends() string {
	return c.Extends
}

func (c *AppConfig) SetExtends(val string) {
	c.Extends = val
}

func (c *AppConfig) CloneConfig() (*AppConfig, error) {
	bytes, err := json.Marshal(c)
	if err != nil {
		return nil, err
	}
	var res AppConfig
	err = json.Unmarshal(bytes, &res)
	if err != nil {
		return nil, err
	}
	return &res, nil
}

func (c *AppConfig) CloneConfigMap() (map[string]any, error) {
	bytes, err := json.Marshal(c)
	if err != nil {
		return nil, err
	}
	var res map[string]any
	err = json.Unmarshal(bytes, &res)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (c *AppConfig) ForumMode() bool {
	return c.Forum != nil && c.Forum.Enabled
}
