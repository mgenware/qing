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

type STManager struct {
	langs []string
}

func NewSTManagerFromConfig(conf *configs.LocalizationConfig) (*STManager, error) {
	return &STManager{
		langs: conf.Langs,
	}, nil
}

// FallbackLanguage returns the default language of this manager.
func (mgr *STManager) FallbackLanguage() string {
	return mgr.langs[0]
}

// LangTags returns language tags.
func (mgr *STManager) LangTags() []language.Tag {
	panic("Not supported")
}

// Dictionary returns the Dictionary associated with the specified language.
func (mgr *STManager) Dictionary(lang string) *Dictionary {
	panic("Not supported")
}

func (mgr *STManager) EnableContextLanguageMW(next http.Handler) http.Handler {
	panic("Not supported")
}
