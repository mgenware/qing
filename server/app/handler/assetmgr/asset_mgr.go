package assetmgr

import (
	"errors"
	"fmt"
	"path/filepath"
	"qing/app/cfg/config"
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
	CSS     *CSSManager
	devMode bool
}

// NewAssetsManager creates a new AssetsManager.
func NewAssetsManager(baseDir string, debugConfig *config.DebugConfig) *AssetsManager {
	jsm := NewJSManager(debugConfig != nil)
	cssm := &CSSManager{BaseDir: baseDir, dev: debugConfig != nil}
	mgr := &AssetsManager{JS: jsm, CSS: cssm}
	return mgr
}
