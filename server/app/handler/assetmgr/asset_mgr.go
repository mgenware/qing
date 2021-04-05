/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package assetmgr

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

// AssetsManager manages external file resources, usually JS and CSS files.
type AssetsManager struct {
	JS      *JSManager
	devMode bool
}

// NewAssetsManager creates a new AssetsManager.
func NewAssetsManager(debugConfig *configs.DebugConfig) *AssetsManager {
	jsm := NewJSManager(debugConfig != nil)
	mgr := &AssetsManager{JS: jsm}
	return mgr
}
