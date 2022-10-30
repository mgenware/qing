/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"fmt"
	"path/filepath"
)

// `g` folder is a sub-folder in `/static` as the root folder
// for all generated resources.
const gFolder = "g"

func scriptTag(src string) string {
	return "<script type=\"module\" src=\"" + src + "\"></script>"
}

func styleTag(src string) string {
	return "<link rel=\"stylesheet\" href=\"" + src + "\"/>"
}

type AssetManager struct {
	devMode bool
	rootURL string
	rootDir string

	// K: name, V: <link> string.
	jsCache   map[string]string
	cssCache  map[string]string
	langCache map[string]string
}

func NewAssetManager(devMode bool, rootURL, rootDir string) *AssetManager {
	r := &AssetManager{}
	r.devMode = devMode
	r.rootURL = filepath.Join(rootURL, gFolder)
	r.rootDir = filepath.Join(rootDir, gFolder)
	r.jsCache = make(map[string]string)
	r.cssCache = make(map[string]string)
	r.langCache = make(map[string]string)
	return r
}

func (asm *AssetManager) MustGetScript(folder, name string) string {
	return asm.mustGetResource(true, "js", folder, name, "js", asm.jsCache)
}

func (asm *AssetManager) MustGetStyle(name string) string {
	if asm.devMode {
		return styleTag(asm.rootURL + "/css/" + name + ".css")
	}
	return asm.mustGetResource(false, "css", "", name, "css", asm.cssCache)
}

func (asm *AssetManager) MustGetLangScript(name string) string {
	return asm.mustGetResource(true, "lang", "", name, "js", asm.langCache)
}

// `category`: js, css, lang
func (asm *AssetManager) mustGetResource(isJS bool, category, folder, name, ext string, cache map[string]string) string {
	v := cache[name]
	if v == "" {
		resolvedFileName, err := asm.fileNameWithHash(category+"/"+folder+"/"+name, ext)
		if err != nil {
			panic(err)
		}
		resolvedURL := asm.rootURL + "/" + category + "/"
		if folder != "" {
			resolvedURL += folder + "/"
		}
		resolvedURL += resolvedFileName
		if isJS {
			v = scriptTag(resolvedURL)
		} else {
			v = styleTag(resolvedURL)
		}
		cache[name] = v
	}
	return v
}

func (asm *AssetManager) fileNameWithHash(name, ext string) (string, error) {
	pattern := filepath.Join(asm.rootDir, name+"-*"+ext)
	res, err := filepath.Glob(pattern)
	if err != nil {
		return "", err
	}
	if len(res) == 0 {
		return "", fmt.Errorf("no match for glob %v", pattern)
	}
	return filepath.Base(res[0]), nil
}
