/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

 /******************************************************************************************
  * Do not edit this file manually.
  * Automatically generated via `qing sod app/appSettings`
  * See `lib/dev/sod/objects/app/appSettings.yaml` for details.
  ******************************************************************************************/

package appSettings

type AppSettings struct {
	Community CommunitySettings `json:"community"`
}

type CommunitySettings struct {
	QueAndDis          bool `json:"queAndDis"`
	ForumsEnabled      bool `json:"forumsEnabled"`
	ForumGroupsEnabled bool `json:"forumGroupsEnabled"`
}
