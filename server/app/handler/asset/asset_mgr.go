package asset

import (
	"errors"
	"fmt"
	"path/filepath"
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

type AssetsManager struct {
	JS      *JSManager
	CSS     *CSSManager
	devMode bool
}

func NewAssetsManager(baseDir string, devMode bool) *AssetsManager {
	jsm := NewJSManager(devMode)
	cssm := &CSSManager{BaseDir: baseDir, dev: devMode}
	mgr := &AssetsManager{JS: jsm, CSS: cssm}
	return mgr
}
