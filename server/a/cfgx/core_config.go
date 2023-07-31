/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cfgx

import (
	"encoding/json"
	"qing/a/cfgx/corecfg"
)

type CoreConfig struct {
	// Specifies another file which this file extends from.
	Extends string `json:"extends,omitempty"`

	Dev       *corecfg.DevConfig       `json:"dev,omitempty"`
	Log       *corecfg.LoggingConfig   `json:"logging,omitempty"`
	HTTP      *corecfg.HTTPConfig      `json:"http,omitempty"`
	Templates *corecfg.TemplatesConfig `json:"templates,omitempty"`

	DB        *corecfg.DBConfig        `json:"db,omitempty"`
	ResServer *corecfg.ResServerConfig `json:"res_server,omitempty"`
	Extern    *corecfg.ExternConfig    `json:"extern,omitempty"`
	Site      *corecfg.SiteConfig      `json:"site,omitempty"`
	Security  *corecfg.SecurityConfig  `json:"security,omitempty"`

	// Only used in unit tests.
	ZTest *ZTestConfig `json:"z_test,omitempty"`
}

func (c *CoreConfig) GetExtends() string {
	return c.Extends
}

func (c *CoreConfig) SetExtends(val string) {
	c.Extends = val
}

// Returns true if dev mode is on.
func (c *CoreConfig) DevMode() bool {
	return c.Dev != nil
}

// Returns true if production mode is on.
func (c *CoreConfig) ProductionMode() bool {
	return !c.DevMode()
}

func (c *CoreConfig) CloneConfig() (*CoreConfig, error) {
	bytes, err := json.Marshal(c)
	if err != nil {
		return nil, err
	}
	var res CoreConfig
	err = json.Unmarshal(bytes, &res)
	if err != nil {
		return nil, err
	}
	return &res, nil
}
