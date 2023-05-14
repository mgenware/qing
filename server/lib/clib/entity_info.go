/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package clib

import "qing/a/def/frozenDef"

// Used in APIs to represent an entity.
type EntityInfo struct {
	ID   uint64
	Type frozenDef.ContentBaseType
}
