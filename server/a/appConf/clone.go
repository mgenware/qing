/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConf

import (
	"encoding/json"
	"qing/a/config"
)

func serializeConfig(conf *config.Config) ([]byte, error) {
	return json.Marshal(conf)
}

func deepCopyConfig(conf *config.Config) (*config.Config, error) {
	bytes, err := serializeConfig(conf)
	if err != nil {
		return nil, err
	}

	var newConf config.Config
	err = json.Unmarshal(bytes, &newConf)
	if err != nil {
		return nil, err
	}
	return &newConf, nil
}
