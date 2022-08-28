/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

const staticDir = "/static/g/"

func scriptTag(src string) string {
	return "<script src=\"" + src + "\"></script>"
}

func styleTag(src string) string {
	return "<link rel=\"stylesheet\" src=\"" + src + "\"/>"
}

func appScriptTag(name string) string {
	return scriptTag(staticDir + "app/" + name + ".js")
}

func appStyleTag(name string) string {
	return styleTag(staticDir + "app/" + name + ".css")
}

func langScriptTag(name string) string {
	return scriptTag(staticDir + "lang/" + name + ".js")
}

type AssetManager struct {
	dev bool

	// K: name, V: <link> string.
	jsCache  map[string]string
	cssCache map[string]string
}

func NewAssetManager(dev bool) *AssetManager {
	r := &AssetManager{}
	r.dev = dev
	r.jsCache = make(map[string]string)
	r.cssCache = make(map[string]string)
	return r
}

func (asm *AssetManager) Script(name string) string {
	v := asm.jsCache[name]
	if v == "" {
		v = appScriptTag(name)
		asm.jsCache[name] = v
	}
	return v
}

func (asm *AssetManager) Style(name string) string {
	v := asm.cssCache[name]
	if v == "" {
		v = appStyleTag(name)
		asm.cssCache[name] = v
	}
	return v
}

func (asm *AssetManager) LangScript(name string) string {
	return langScriptTag(name)
}
