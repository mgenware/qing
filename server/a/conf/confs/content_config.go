/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package confs

import "qing/a/def/frozenDef"

type ContentConfig struct {
	RawInputType string `json:"input_type,omitempty"`
}

func (sc *ContentConfig) InputType() frozenDef.ContentInputTypeConfig {
	return frozenDef.ContentInputTypeConfig(sc.RawInputType)
}
