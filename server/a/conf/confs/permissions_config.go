/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package confs

import (
	"qing/a/def/appdef"
)

type PermissionsConfig struct {
	RawPost int `json:"post,omitempty"`
}

func (sc *PermissionsConfig) Post() appdef.PostPermission {
	return appdef.PostPermission(sc.RawPost)
}
