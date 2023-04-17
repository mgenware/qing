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

	pathCache map[string]string
}

func NewAssetManager(devMode bool, rootURL, rootDir string) *AssetManager {
	r := &AssetManager{}
	r.devMode = devMode
	r.rootURL = rootURL
	r.rootDir = rootDir
	r.pathCache = make(map[string]string)
	return r
}

func (asm *AssetManager) MustGetScript(name string) string {
	return asm.mustGetResource(true, "g/js", name, "js")
}

func (asm *AssetManager) MustGetStyle(name string) string {
	return asm.mustGetResource(false, "g/css", name, "css")
}

func (asm *AssetManager) MustGetLangScript(name, subdir string) string {
	return asm.mustGetResource(true, "lang/"+subdir, name, "js")
}

// `category`: js, css, lang
func (asm *AssetManager) mustGetResource(isJS bool, parentDir, name, ext string) string {
	cacheKey := parentDir + "|" + name + "|" + ext
	v := asm.pathCache[cacheKey]
	if v == "" {
		relPath, err := asm.lookupFilePath(parentDir, name, ext)
		if err != nil {
			panic(err)
		}
		resolvedURL := asm.rootURL + "/" + relPath
		if isJS {
			v = scriptTag(resolvedURL)
		} else {
			v = styleTag(resolvedURL)
		}

		asm.pathCache[cacheKey] = v
	}
	return v
}

func (asm *AssetManager) lookupFilePath(parentPath, name, ext string) (string, error) {
	pattern := filepath.Join(asm.rootDir, parentPath, name+"-*"+ext)
	res, err := filepath.Glob(pattern)
	if err != nil {
		return "", err
	}
	if len(res) == 0 {
		return "", fmt.Errorf("no match for glob %v", pattern)
	}
	relPath, err := filepath.Rel(asm.rootDir, res[0])
	if err != nil {
		return "", err
	}
	return relPath, nil
}
