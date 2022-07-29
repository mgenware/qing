/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package jsm

func scriptTag(src string) string {
	return "<script src=\"" + src + "\"></script>"
}

func appScriptTag(name string) string {
	return scriptTag("/static/g/app/" + name + ".js")
}

func langScriptTag(name string) string {
	return scriptTag("/static/g/lang/" + name + ".js")
}

// JSManager manages JS assets.
type JSManager struct {
	dev bool

	// K: name, V: <script> string.
	entries map[string]string
}

// NewJSManager creates a new NewJSManager.
func NewJSManager(dev bool) *JSManager {
	r := &JSManager{}
	r.dev = dev
	r.entries = make(map[string]string)
	return r
}

func (jsm *JSManager) ScriptString(name string) string {
	v := jsm.entries[name]
	if v == "" {
		v = appScriptTag(name)
		jsm.entries[name] = v
	}
	return v
}

func (jsm *JSManager) LangScriptString(name string) string {
	return langScriptTag(name)
}
