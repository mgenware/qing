/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"encoding/json"
	"os"
)

func ReadJSONFile(file string, v interface{}) error {
	bytes, err := os.ReadFile(file)
	if err != nil {
		return err
	}
	return json.Unmarshal(bytes, v)
}

func WriteJSONFile(file string, v interface{}) error {
	bytes, err := json.Marshal(v)
	if err != nil {
		return err
	}

	return os.WriteFile(file, bytes, 0644)
}
