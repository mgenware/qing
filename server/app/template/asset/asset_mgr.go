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
	jsm := &JSManager{BaseDir: baseDir, dev: devMode}
	cssm := &CSSManager{BaseDir: baseDir, dev: devMode}
	mgr := &AssetsManager{JS: jsm, CSS: cssm}

	if devMode {
		mgr.scanForDev()
	} else {
		mgr.scanForProd()
	}
	return mgr
}

func (m *AssetsManager) scanForDev() {
	jsm := m.JS
	jsm.LSCS = jsm.NamedJSFromRoot("ls_cs")
	jsm.LSEN = jsm.NamedJSFromRoot("ls_en")
	jsm.Main = jsm.NamedJSFromRoot("main_dev")
}

func (m *AssetsManager) scanForProd() {
	jsm := m.JS
	cssm := m.CSS

	jsm.LSCS = jsm.HashedJS("ls_cs")
	jsm.LSEN = jsm.HashedJS("ls_en")
	jsm.Vendor = jsm.HashedJS("chunk-vendors")
	jsm.Main = jsm.HashedJS("main")

	cssm.Main = cssm.HashedCSS("main")
	cssm.Vendor = cssm.HashedCSS("chunk-vendors")
}
