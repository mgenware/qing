/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSettings

type AppSettings struct {
	Forums *ForumsSettings `json:"forums"`
}

type ForumsSettings struct {
	ForumsEnabled      bool `json:"forums_enabled"`
	ForumGroupsEnabled bool `json:"forum_groups_enabled"`
}

func (s *AppSettings) ForumsMode() bool {
	return s.Forums.ForumsEnabled
}
