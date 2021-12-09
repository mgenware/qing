/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

export interface AppSettings {
  community?: CommunitySettings;
}

export interface CommunitySettings {
  queAndDis?: boolean;
  forumsEnabled?: boolean;
  forumGroupsEnabled?: boolean;
}
