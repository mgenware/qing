/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod api`.
 * See `lib/dev/sod/objects/api.yaml` for details.
 ******************************************************************************************/

package apiSod

type NameAndID struct {
	ID   string `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

func NewNameAndID(id string, name string) NameAndID {
	return NameAndID{
		ID: id,
		Name: name,
	}
}