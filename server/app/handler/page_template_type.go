/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import "io"

type PageTemplateType interface {
	Execute(wr io.Writer, data interface{}) error
	ExecuteToString(data interface{}) (string, error)
	MustExecute(wr io.Writer, data interface{})
	MustExecuteToString(data interface{}) string
}
