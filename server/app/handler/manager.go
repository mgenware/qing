package handler

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"qing/app/cfg"
	"qing/app/cm"
	txt "text/template"

	"qing/app/defs"
	"qing/app/handler/asset"
	"qing/app/handler/localization"
	"qing/app/logx"

	"github.com/mgenware/go-packagex/v5/httpx"
	"github.com/mgenware/go-packagex/v5/templatex"
	strf "github.com/mgenware/go-string-format"
)

// Manager provides common functions to generate HTML strings.
type Manager struct {
	dir    string
	config *cfg.Config

	reloadViewsOnRefresh bool
	log404Error          bool

	masterView          *LocalizedView
	errorView           *LocalizedView
	LocalizationManager *localization.Manager
	AssetsManager       *asset.AssetsManager
	logger              *logx.Logger
}

// MustCreateManager creates an instance of TemplateManager with specified arguments. Note that this function panics when main template loading fails.
func MustCreateManager(
	dir string,
	i18nDir string,
	defaultLang string,
	assetMgr *asset.AssetsManager,
	logger *logx.Logger,
	config *cfg.Config,
) *Manager {
	reloadViewsOnRefresh := config.Debug != nil && config.Debug.ReloadViewsOnRefresh
	if reloadViewsOnRefresh {
		log.Print("⚠️ View dev mode is on")
	}

	// Create the localization manager used by localized template views
	localizationManager, err := localization.NewManagerFromDirectory(i18nDir, defaultLang)
	if err != nil {
		panic(err)
	}

	t := &Manager{
		dir:                  dir,
		LocalizationManager:  localizationManager,
		AssetsManager:        assetMgr,
		logger:               logger,
		config:               config,
		reloadViewsOnRefresh: reloadViewsOnRefresh,
		log404Error:          config.HTTP.Log404Error,
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
func (m *Manager) MustComplete(r *http.Request, lang string, d *MasterPageData, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)

	ctx := r.Context()
	// Ensure lang always has a value
	if lang == "" {
		lang = m.LocalizationManager.DefaultLanguage()
	}

	// Add site name to title
	d.Title = m.PageTitle(lang, d.Title)

	// Setup additional assets
	assetsMgr := m.AssetsManager
	css := assetsMgr.CSS
	js := assetsMgr.JS

	d.Header = css.Vendor + css.Main + d.Header
	d.AppLang = lang

	script := ""
	// Language file, this should be loaded first as the main.js relies on it.
	if m.config.Debug != nil {
		// Read the JSON content and inject it to master page in dev mode
		jsonFileName := fmt.Sprintf("%v.json", lang)
		jsonFile := filepath.Join(m.config.Localization.Dir, jsonFileName)
		jsonBytes, err := ioutil.ReadFile(jsonFile)
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

	// Main JS files
	script += js.Loader + js.Polyfills + js.Main

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
func (m *Manager) MustError(r *http.Request, lang string, err error, expected bool, w http.ResponseWriter) HTML {
	d := &ErrorPageData{Message: err.Error()}
	// Handle unexpected errors
	if !expected {
		if err == sql.ErrNoRows {
			// Consider `sql.ErrNoRows` as 404 not found error
			w.WriteHeader(http.StatusNotFound)
			// Set `expected` to `true`
			expected = true

			d.Message = m.LocalizedString(lang, "resourceNotFound")
			if m.config.HTTP.Log404Error {
				m.logger.NotFound("sql", r.URL.String())
			}
		} else {
			// At this point, this should be a 500 server internal error
			w.WriteHeader(http.StatusInternalServerError)
			m.logger.Error("fatal-error", "msg", d.Message)
		}
	}
	errorHTML := m.errorView.MustExecuteToString(lang, d)
	htmlData := NewMasterPageData(m.LocalizedString(lang, "errOccurred"), errorHTML)
	m.MustComplete(r, lang, htmlData, w)
	return HTML(0)
}

// PageTitle returns the given string followed by the localized site name.
func (m *Manager) PageTitle(lang, s string) string {
	return s + " - " + m.LocalizationManager.ValueForKey(lang, "_siteName")
}

// MustParseLocalizedView creates a new LocalizedView with the given relative path.
func (m *Manager) MustParseLocalizedView(relativePath string) *LocalizedView {
	file := filepath.Join(m.dir, relativePath)
	view := templatex.MustParseView(file, m.reloadViewsOnRefresh)
	return &LocalizedView{view: view, localizationManager: m.LocalizationManager}
}

// MustParseView creates a new View with the given relative path.
func (m *Manager) MustParseView(relativePath string) *templatex.View {
	file := filepath.Join(m.dir, relativePath)
	return templatex.MustParseView(file, m.reloadViewsOnRefresh)
}

// LocalizedString is a convenience function of LocalizationManager.ValueForKey.
func (m *Manager) LocalizedString(lang, key string) string {
	return m.LocalizationManager.ValueForKey(lang, key)
}

// FormatLocalizedString is a convenience function to format a localized string.
func (m *Manager) FormatLocalizedString(lang, key string, a ...interface{}) string {
	return strf.Format(m.LocalizedString(lang, key), a...)
}
