/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

package appSettingsObj

type CommunitySettings struct {
	CommunityMode      bool `json:"communityMode"`
	ForumsEnabled      bool `json:"forumsEnabled"`
	ForumGroupsEnabled bool `json:"forumGroupsEnabled"`
}
