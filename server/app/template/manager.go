package template

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"qing/app/cm"
	"qing/app/config/internals"
	txt "text/template"

	"qing/app/defs"
	"qing/app/logx"
	"qing/app/template/asset"
	"qing/app/template/localization"

	"github.com/mgenware/go-packagex/httpx"
	"github.com/mgenware/go-packagex/templatex"
	strf "github.com/mgenware/go-string-format"
)

// Manager provides common functions to generate HTML strings.
type Manager struct {
	dir         string
	debugConfig *internals.DebugConfig

	masterView          *LocalizedView
	errorView           *LocalizedView
	LocalizationManager *localization.Manager
	assetMgr            *asset.AssetsManager
	logger              *logx.Logger
}

// MustCreateManager creates an instance of TemplateManager with specified arguments. Note that this function panics when main template loading fails.
func MustCreateManager(
	dir string,
	i18nDir string,
	defaultLang string,
	assetMgr *asset.AssetsManager,
	logger *logx.Logger,
	debugConfig *internals.DebugConfig,
) *Manager {
	if debugConfig != nil && debugConfig.ReloadViewsOnRefresh {
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
		assetMgr:            assetMgr,
		logger:              logger,
		debugConfig:         debugConfig,
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
func (m *Manager) MustComplete(ctx context.Context, lang string, d *MasterPageData, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)
	// Ensure lang always has a value
	if lang == "" {
		lang = m.LocalizationManager.DefaultLanguage()
	}

	// Setup additional assets
	assetsMgr := m.assetMgr
	css := assetsMgr.CSS
	js := assetsMgr.JS

	d.Header = css.Vendor + css.Main + d.Header
	d.AppLang = lang

	script := ""
	// Language file, this should be loaded first as the app.js relies on it.
	if m.debugConfig != nil {
		// Read the JSON content and inject it to master page in dev mode
		jsonBytes, err := ioutil.ReadFile(fmt.Sprintf("../localization/langs/%v.json", lang))
		if err != nil {
			panic(err) // can panic in dev mode
		}
		var buffer bytes.Buffer
		err = json.Compact(&buffer, jsonBytes)
		if err != nil {
			panic(err) // can panic in dev mode
		}
		script += "<script>window.ls=JSON.parse(\"" + txt.JSEscapeString(buffer.String()) + "\")</script>"
	} else {
		var langJS string
		if lang == defs.LanguageCSString {
			langJS = assetsMgr.JS.LSCS
		} else {
			langJS = assetsMgr.JS.LSEN
		}
		script += langJS
	}

	// Main app.js
	script += js.Vendor + js.Main

	// System scripts come before user scripts
	d.Scripts = script + d.Scripts

	// User info
	user := cm.ContextUser(ctx)
	if user != nil {
		d.AppUserID = user.EID
		d.AppUserName = user.Name
		d.AppUserIconURL = user.IconURL
		d.AppUserURL = user.URL
	}

	m.masterView.MustExecute(lang, w, d)
}

// MustError executes the main view template with the specified data and panics if error occurs.
func (m *Manager) MustError(ctx context.Context, lang string, d *ErrorPageData, w http.ResponseWriter) {
	if !d.Expected && m.debugConfig != nil && m.debugConfig.PanicOnUnexpectedHTMLErrors {
		fmt.Println("🙉 This message only appears in dev mode.")
		if d.Error != nil {
			panic(d.Error)
		} else {
			panic(d.Message)
		}
	}
	// Log unexpected errors
	if !d.Expected {
		msg := d.Message
		if d.Error != nil {
			msg += "(" + d.Error.Error() + ")"
		}
		m.logger.LogError("app.unexpected-error", logx.D{"msg": msg})
	}
	errorHTML := m.errorView.MustExecuteToString(lang, d)
	htmlData := NewMasterPageData("Error", errorHTML)
	m.MustComplete(ctx, lang, htmlData, w)
}

// PageTitle returns the given string followed by the localized site name.
func (m *Manager) PageTitle(lang, s string) string {
	return s + " - " + m.LocalizationManager.ValueForKey(lang, "_siteName")
}

// LocalizedPageTitle calls PageTitle with a localized string associated with the specified key.
func (m *Manager) LocalizedPageTitle(lang, key string) string {
	ls := m.LocalizationManager.ValueForKey(lang, key)
	return m.PageTitle(lang, ls)
}

// MustParseLocalizedView creates a new LocalizedView with the given relative path.
func (m *Manager) MustParseLocalizedView(relativePath string) *LocalizedView {
	file := filepath.Join(m.dir, relativePath)
	view := templatex.MustParseView(file, m.debugConfig != nil)
	return &LocalizedView{view: view, localizationManager: m.LocalizationManager}
}

// MustParseView creates a new View with the given relative path.
func (m *Manager) MustParseView(relativePath string) *templatex.View {
	file := filepath.Join(m.dir, relativePath)
	return templatex.MustParseView(file, m.debugConfig != nil)
}

// LocalizedString is a convenience function of LocalizationManager.ValueForKey.
func (m *Manager) LocalizedString(lang, key string) string {
	return m.LocalizationManager.ValueForKey(lang, key)
}

// FormatLocalizedString is a convenience function to format a localized string.
func (m *Manager) FormatLocalizedString(lang, key string, a ...interface{}) string {
	return strf.Format(m.LocalizedString(lang, key), a...)
}
