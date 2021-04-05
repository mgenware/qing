/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package localization

import "golang.org/x/text/language"

type CoreManager interface {
	FallbackLanguage() string
	LangTags() []language.Tag
	Dictionary(lang string) *Dictionary
}
