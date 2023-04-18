/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package confs

// This config only exists for unit tests.
type ZTestConfig struct {
	A int `json:"a,omitempty"`
	B int `json:"b,omitempty"`
	C int `json:"c,omitempty"`
}
