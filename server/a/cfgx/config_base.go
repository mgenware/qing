/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cfgx

type ConfigBase interface {
	GetExtends() string
	SetExtends(val string)
}