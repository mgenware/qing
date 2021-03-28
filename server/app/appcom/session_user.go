/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appcom

import "encoding/json"

// SessionUser contains user infomation stored in a session store.
type SessionUser struct {
	ID         uint64 `json:"id,omitempty"`
	Name       string `json:"name,omitempty"`
	IconName   string `json:"icon,omitempty"`
	Admin      bool   `json:"admin,omitempty"`
	Status     string `json:"status,omitempty"`
	IsForumMod bool   `json:"is_mod,omitempty"`

	// Generated props when deserialized
	URL     string `json:"-"`
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
