package sanitizer

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

// Sanitize sanitizes the given input string.
func (s *Sanitizer) Sanitize(input string) string {
	return s.policy.Sanitize(input)
}
