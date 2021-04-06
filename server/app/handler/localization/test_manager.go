/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package localization

import (
	"net/http"
	"qing/app/config/configs"

	"golang.org/x/text/language"
)

type TestManager struct {
}

func NewTestManagerFromConfig(conf *configs.LocalizationConfig) (*TestManager, error) {
	return &TestManager{}, nil
}

// FallbackLanguage returns the default language of this manager.
func (mgr *TestManager) FallbackLanguage() string {
	panic("Not supported")
}

// LangTags returns language tags.
func (mgr *TestManager) LangTags() []language.Tag {
	panic("Not supported")
}

// Dictionary returns the Dictionary associated with the specified language.
func (mgr *TestManager) Dictionary(lang string) *Dictionary {
	panic("Not supported")
}

func (mgr *TestManager) EnableContextLanguageMW(next http.Handler) http.Handler {
	panic("Not supported")
}
