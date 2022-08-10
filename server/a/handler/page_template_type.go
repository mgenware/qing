/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import "io"

type CoreTemplate interface {
	Execute(wr io.Writer, data any) error
	ExecuteToString(data any) (string, error)
	MustExecute(wr io.Writer, data any)
	MustExecuteToString(data any) string
}

type CoreLocalizedTemplate interface {
	Execute(lang string, wr io.Writer, data ILocalizedTemplateData) error
	ExecuteToString(lang string, data ILocalizedTemplateData) (string, error)
	MustExecute(lang string, wr io.Writer, data ILocalizedTemplateData)
	MustExecuteToString(lang string, data ILocalizedTemplateData) string
}
