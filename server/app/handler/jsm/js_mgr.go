/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package jsm

import (
	"errors"
	"fmt"
	"path/filepath"
	"qing/app/config/configs"
)

func match(rootDir string, file string) (string, error) {
	if file == "" {
		return "", errors.New("Empty file")
	}

	glob := filepath.Join(rootDir, file)
	matches, err := filepath.Glob(glob)
	if err != nil {
		return "", err
	}
	if len(matches) < 1 {
		return "", fmt.Errorf("No match on query '%v'", glob)
	} else if len(matches) > 1 {
		return "", fmt.Errorf("Ambiguous matches on query '%v'", glob)
	}
	rel, err := filepath.Rel(rootDir, matches[0])
	if err != nil {
		return "", err
	}
	return "/static/" + rel, nil
}

func htmlScript(src string, module bool) string {
	s := "<script src=\"" + src + "\""
	if module {
		s += " type=\"module\""
	}
	s += "></script>"
	return s
}

func sysScript(src string) string {
	return "<script>System.import('" + src + "')</script>"
}

func libJS(name string) string {
	return htmlScript("/static/lib/"+name+".js", false)
}

func pageJS(name string) string {
	return sysScript("/static/d/js/" + name + ".js")
}

// JSManager manages JS assets.
type JSManager struct {
	dev  bool
	conf *configs.TurboWebConfig

	// SystemScripts are scripts that have to be applied before page scripts.
	SystemScripts string

	// K: name, V: <script> string.
	entries map[string]string
}

// NewJSManager creates a new NewJSManager.
func NewJSManager(dev bool) *JSManager {
	r := &JSManager{}
	r.dev = dev
	r.entries = make(map[string]string)

	var mainEntryJS string
	if r.dev {
		mainEntryJS = pageJS("coreEntryDev")
	} else {
		mainEntryJS = pageJS("coreEntry")
	}

	r.SystemScripts = libJS("s6.3.2.min") + libJS("webcomponents-bundle") + mainEntryJS
	return r
}

func (jsm *JSManager) ScriptString(name string) string {
	v := jsm.entries[name]
	if v == "" {
		v = pageJS(name)
		jsm.entries[name] = v
	}
	return v
}
