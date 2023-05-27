/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package localization

import (
	"fmt"
	"net/http"
	"qing/a/cfgx"

	"golang.org/x/text/language"
)

type TestManager struct {
	langs []string
}

func NewTestManagerFromConfig(cc *cfgx.CoreConfig) (*TestManager, error) {
	return &TestManager{
		langs: cc.Site.Langs,
	}, nil
}

// FallbackLanguage returns the default language of this manager.
func (mgr *TestManager) FallbackLanguage() string {
	return mgr.langs[0]
}

// LangTags returns language tags.
func (mgr *TestManager) LangTags() []language.Tag {
	panic(fmt.Errorf("not supported"))
}

// Dictionary returns the Dictionary associated with the specified language.
func (mgr *TestManager) Dictionary(lang string) *Dictionary {
	return TestDict
}

func (mgr *TestManager) EnableContextLanguageMW(next http.Handler) http.Handler {
	panic(fmt.Errorf("not supported"))
}
