package nl

import (
	"fmt"
	"path/filepath"
	"qing/lib/io2"
	"strings"

	"github.com/mgenware/go-packagex/iox"
)

const (
	SanitizeApp = "sanitize"
)

// NL manages how we call external node libs.
type NL struct {
	// Dir is the root directory of our node libs. Individual services are in sub-directories.
	Dir string
}

// ping checks if node is installed.
func (nl *NL) ping(appName string) error {
	out, err := io2.Exec("node", filepath.Join(nl.Dir, appName, "main.js"), "--ping")
	out = strings.TrimSpace(out)
	if out != "pong" {
		return fmt.Errorf("Got unexpected output \"%v\"", out)
	}
	return err
}

// NewNL creates an NL.
func NewNL(dir string) (*NL, error) {
	if !iox.IsDirectory(dir) {
		return nil, fmt.Errorf("The node libs root directory \"%v\" does not exist", dir)
	}
	res := &NL{Dir: dir}
	err := res.ping(SanitizeApp)
	if err != nil {
		return nil, err
	}
	return res, nil
}
