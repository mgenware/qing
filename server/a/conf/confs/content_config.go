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

type ContentConfig struct {
	RawInputType int `json:"input_type,omitempty"`
}

func (sc *ContentConfig) InputType() appdef.ContentInputType {
	return appdef.ContentInputType(sc.RawInputType)
}
