/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import "qing/a/handler/localization"

// ILocalizedTemplateData is the base type for all localized page data types.
type ILocalizedTemplateData interface {
	SetLS(value *localization.Dictionary)
}

// LocalizedTemplateData implements ILocalizedTemplateData.
type LocalizedTemplateData struct {
	LS *localization.Dictionary `json:"-"`
}

func (td *LocalizedTemplateData) SetLS(value *localization.Dictionary) {
	td.LS = value
}
