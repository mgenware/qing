/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package confs

import "qing/a/def/frozenDef"

type PermissionsConfig struct {
	RawPost string `json:"post,omitempty"`
}

func (sc *PermissionsConfig) Post() frozenDef.PostPermissionConfig {
	return frozenDef.PostPermissionConfig(sc.RawPost)
}
