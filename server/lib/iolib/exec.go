/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package iolib

import (
	"fmt"
	"os/exec"
)

// Exec spawns a shell that executes the given command and arguments.
func Exec(name string, args ...string) (string, error) {
	cmd := exec.Command(name, args...)
	output, err := cmd.CombinedOutput()

	if err != nil {
		return "", fmt.Errorf("error running \"%v\n%v\"\nOutput: %v", name, err.Error(), string(output))
	}
	return string(output), nil
}
