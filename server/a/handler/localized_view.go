/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"io"

	"qing/a/handler/localization"
)

// LocalizedView wraps a templatex.View, providing localization support.
type LocalizedView struct {
	localizationManager localization.CoreManager
	view                CoreTemplate
}

func (v *LocalizedView) Execute(lang string, wr io.Writer, data ILocalizedTemplateData) error {
	return v.view.Execute(wr, v.coerceTemplateData(data, lang))
}

func (v *LocalizedView) ExecuteToString(lang string, data ILocalizedTemplateData) (string, error) {
	return v.view.ExecuteToString(v.coerceTemplateData(data, lang))
}

func (v *LocalizedView) MustExecuteToString(lang string, data ILocalizedTemplateData) string {
	return v.view.MustExecuteToString(v.coerceTemplateData(data, lang))
}

func (v *LocalizedView) MustExecute(lang string, wr io.Writer, data ILocalizedTemplateData) {
	v.view.MustExecute(wr, v.coerceTemplateData(data, lang))
}

func (v *LocalizedView) coerceTemplateData(data ILocalizedTemplateData, lang string) any {
	dict := v.localizationManager.Dictionary(lang)
	data.SetLS(dict)
	return data
}
