/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

import "encoding/json"

type AppSettings struct {
	CommunityMode      bool `json:"communityMode"`
	ForumsEnabled      bool `json:"forumsMode"`
	ForumGroupsEnabled bool `json:"forumGroupsMode"`
}

func (s *AppSettings) DeepClone() (*AppSettings, error) {
	bytes, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}

	copy := &AppSettings{}
	if err = json.Unmarshal(bytes, &copy); err != nil {
		return nil, err
	}

	return copy, nil
}
