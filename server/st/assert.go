/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package st

import (
	"runtime/debug"
	"testing"

	"github.com/google/go-cmp/cmp"
)

// AssertEqual compares the given two values, and make testing fail if they are not equivalent.
func AssertEqual(t *testing.T, got, want interface{}) {
	if diff := cmp.Diff(want, got); diff != "" {
		debug.PrintStack()
		t.Fatalf("Mismatch (-want +got):\n%s", diff)
	}
}

// Assert makes testing fail if `b` is false.
func Assert(t *testing.T, b bool) {
	if !b {
		debug.PrintStack()
		t.Fatalf("Assertion failed")
	}
}

// PanicIfErr panics if the given error is not nil.
func PanicIfErr(err error) {
	if err != nil {
		panic(err)
	}
}
