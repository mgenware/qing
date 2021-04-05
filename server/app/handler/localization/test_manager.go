/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package localization

import (
	"errors"
	"net/http"
	"qing/app/config/configs"

	"golang.org/x/text/language"
)

type TestManager struct {
	langs []string
}

func NewTestManagerFromConfig(conf *configs.LocalizationConfig) (*TestManager, error) {
	if len(conf.Langs) == 0 {
		return nil, errors.New("Unexpected empty `langs` config")
	}
	return &TestManager{langs: conf.Langs}, nil
}

// FallbackLanguage returns the default language of this manager.
func (mgr *TestManager) FallbackLanguage() string {
	return mgr.langs[0]
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
