/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package htmllib

import (
	"github.com/microcosm-cc/bluemonday"
)

// Sanitizer ...
type Sanitizer struct {
	policy *bluemonday.Policy
}

// NewSanitizer creates a new sanitizer.
func NewSanitizer() *Sanitizer {
	p := bluemonday.UGCPolicy()
	return &Sanitizer{policy: p}
}

// Sanitize sanitizes the given input HTML string.
func (s *Sanitizer) Sanitize(html string) (string, int) {
	// Return the sanitized content along with a dummy integer as an argument stub for later use
	return s.policy.Sanitize(html), 0
}
