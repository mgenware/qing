package cmdlib

import (
	"strings"

	"github.com/mgenware/j9/v2"
)

func GetGitRootDir(tunnel *j9.Tunnel) string {
	output := tunnel.RunSync("git rev-parse --show-toplevel")
	return strings.Trim(string(output), "\n")
}
