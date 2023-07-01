/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package httplib

import (
	"errors"
	"net/http"
)

func GetRealIP(r *http.Request, header string) (string, error) {
	if header == "" {
		return "", errors.New("empty header")
	}
	return r.Header.Get(header), nil
}
