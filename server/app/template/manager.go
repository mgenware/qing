package template

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"qing/app/defs"
	"qing/app/template/asset"
	"qing/app/template/localization"

	"github.com/mgenware/go-packagex/httpx"
	"github.com/mgenware/go-packagex/templatex"
)

// Manager provides common functions to generate HTML strings.
type Manager struct {
	devMode bool
	dir     string

	masterView          *LocalizedView
	errorView           *LocalizedView
	LocalizationManager *localization.Manager
	assetMgr            *asset.AssetsManager
}

// MustCreateManager creates an instance of TemplateManager with specified arguments. Note that this function panics when main template loading fails.
func MustCreateManager(
	dir string,
	devMode bool,
	i18nDir string,
	defaultLang string,
	assetMgr *asset.AssetsManager,
) *Manager {
	if devMode {
		log.Print("⚠️ View dev mode is on")
	}

	// Create the localization manager used by localized template views
	localizationManager, err := localization.NewManagerFromDirectory(i18nDir, defaultLang)
	if err != nil {
		panic(err)
	}

	t := &Manager{
		dir:                 dir,
		LocalizationManager: localizationManager,
		devMode:             devMode,
		assetMgr:            assetMgr,
	}

	// Load the master template
	t.masterView = t.MustParseLocalizedView("master.html")
	// Load the error template
	t.errorView = t.MustParseLocalizedView("error.html")

	return t
}

// MustCompleteWithContent finished the response with the given HTML content.
func (m *Manager) MustCompleteWithContent(content []byte, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)
	w.Write(content)
}

// MustComplete executes the main view template with the specified data and panics if error occurs.
func (m *Manager) MustComplete(lang string, d *MasterPageData, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)

	// Setup additional assets
	assetsMgr := m.assetMgr
	css := assetsMgr.CSS
	js := assetsMgr.JS

	d.Header = css.Vendor + css.Main + d.Header

	d.Scripts = js.Vendor + js.Main + d.Scripts
	d.AppLang = lang
	if !m.devMode {
		// Inject i18n js in production
		var langJS string
		if lang == defs.LanguageCSString {
			langJS = assetsMgr.JS.LSCS
		} else {
			langJS = assetsMgr.JS.LSEN
		}
		d.Scripts += langJS
	}

	m.masterView.MustExecute(lang, w, d)
}

// MustError executes the main view template with the specified data and panics if error occurs.
func (m *Manager) MustError(lang string, d *ErrorPageData, w http.ResponseWriter) {
	if m.devMode && !d.Expected {
		fmt.Println("🙉 This message only appears in dev mode.")
		if d.Error != nil {
			panic(d.Error)
		} else {
			panic(d.Message)
		}
	}
	errorHTML := m.errorView.MustExecuteToString(lang, d)
	htmlData := NewMasterPageData("Error", errorHTML)
	m.MustComplete(lang, htmlData, w)
}

// NewTitle adds a consistent suffix to the specified title.
func (m *Manager) NewTitle(t string) string {
	return t + " - " + defs.SiteTitle
}

// NewLocalizedTitle calls NewTitle with a localized title associated with the specified key.
func (m *Manager) NewLocalizedTitle(lang, key string) string {
	ls := m.LocalizationManager.ValueForKey(lang, key)
	return m.NewTitle(ls)
}

// MustParseLocalizedView creates a new LocalizedView with the given relative path.
func (m *Manager) MustParseLocalizedView(relativePath string) *LocalizedView {
	file := filepath.Join(m.dir, relativePath)
	view := templatex.MustParseView(file, m.devMode)
	return &LocalizedView{view: view, localizationManager: m.LocalizationManager}
}

// MustParseView creates a new View with the given relative path.
func (m *Manager) MustParseView(relativePath string) *templatex.View {
	file := filepath.Join(m.dir, relativePath)
	return templatex.MustParseView(file, m.devMode)
}

// LocalizedString is a convenience function of LocalizationManager.ValueForKey.
func (m *Manager) LocalizedString(lang, key string) string {
	return m.LocalizationManager.ValueForKey(lang, key)
}

// FormatLocalizedString is a convenience function to format a localized string.
func (m *Manager) FormatLocalizedString(lang, key string, a ...interface{}) string {
	return fmt.Sprintf(m.LocalizedString(lang, key), a...)
}
