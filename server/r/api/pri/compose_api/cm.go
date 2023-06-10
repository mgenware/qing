/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package composeapi

import (
	"qing/a/def/appDef"
	"qing/lib/clib"

	"github.com/mgenware/goutil/jsonx"
)

type PostCoreContentLoader struct {
	dict map[string]any
}

func NewPostCoreContentLoader(dict map[string]any) PostCoreContentLoader {
	return PostCoreContentLoader{dict: dict}
}

func (v PostCoreContentLoader) MustGetTitle() string {
	return clib.MustGetStringFromDict(v.dict, "title", appDef.LenMaxTitle)
}

func (v PostCoreContentLoader) MustGetSummary() string {
	return clib.MustGetTextFromDict(v.dict, "summary")
}

func (v PostCoreContentLoader) MustGetHTML() string {
	return clib.MustGetTextFromDict(v.dict, "html")
}

func (v PostCoreContentLoader) GetOptionalSrc() *string {
	return jsonx.GetStringOrNil(v.dict, "src")
}
