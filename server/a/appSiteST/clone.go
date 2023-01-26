/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appSiteST

import (
	"encoding/json"
	"qing/a/sitest"
)

func serializeConfig(st *sitest.SiteSettings) ([]byte, error) {
	return json.Marshal(st)
}

func DeepCopyConfig(st *sitest.SiteSettings) (*sitest.SiteSettings, error) {
	bytes, err := serializeConfig(st)
	if err != nil {
		return nil, err
	}

	var newST sitest.SiteSettings
	err = json.Unmarshal(bytes, &newST)
	if err != nil {
		return nil, err
	}
	return &newST, nil
}
