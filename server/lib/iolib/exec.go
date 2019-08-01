package iolib

import (
	"fmt"
	"os/exec"
)

func Exec(name string, arg ...string) (string, error) {
	cmd := exec.Command(name, arg...)
	output, err := cmd.CombinedOutput()

	if err != nil {
		return "", fmt.Errorf("Error exec %v\n%v\nOutput: %v", name, err.Error(), string(output))
	}
	return string(output), nil
}
