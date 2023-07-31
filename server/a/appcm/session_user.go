/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appcm

import (
	"encoding/json"
)

// SessionUser contains user information stored in a session store.
type SessionUser struct {
	ID       uint64 `json:"i,omitempty"`
	Name     string `json:"n,omitempty"`
	IconName string `json:"ico,omitempty"`
	Admin    bool   `json:"adm,omitempty"`
	Lang     string `json:"lan,omitempty"`

	// Generated props when deserialized
	Link    string `json:"-"`
	IconURL string `json:"-"`
	EID     string `json:"-"`
}

// Serialize encode the user object to JSON.
func (u *SessionUser) Serialize() (string, error) {
	b, err := json.Marshal(u)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
