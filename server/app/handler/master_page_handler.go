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
	"qing/app/appcom"
	"qing/app/cfg"
	txt "text/template"

	"qing/app/defs"
	"qing/app/handler/assetmgr"
	"qing/app/handler/localization"
	"qing/app/logx"

	"github.com/mgenware/go-packagex/v5/httpx"
	"github.com/mgenware/go-packagex/v5/templatex"
)

// MasterPageManager is used to generate site master HTML page.
type MasterPageManager struct {
	dir    string
	config *cfg.Config

	reloadViewsOnRefresh bool
	log404Error          bool

	masterView          *LocalizedView
	errorView           *LocalizedView
	LocalizationManager *localization.Manager
	AssetsManager       *assetmgr.AssetsManager
	logger              *logx.Logger
}

// MustCreateMasterPageManager creates an instance of MasterPageManager with the specified arguments. Note that this function panics when master template fails to load.
func MustCreateMasterPageManager(
	dir string,
	i18nDir string,
	defaultLang string,
	assetMgr *assetmgr.AssetsManager,
	logger *logx.Logger,
	config *cfg.Config,
) *MasterPageManager {
	reloadViewsOnRefresh := config.Debug != nil && config.Debug.ReloadViewsOnRefresh
	if reloadViewsOnRefresh {
		log.Print("⚠️ View dev mode is on")
	}

	// Create the localization manager used by localized template views
	localizationManager, err := localization.NewManagerFromDirectory(i18nDir, defaultLang)
	if err != nil {
		panic(err)
	}

	t := &MasterPageManager{
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
func (m *MasterPageManager) MustCompleteWithContent(content []byte, w http.ResponseWriter) {
	httpx.SetResponseContentType(w, httpx.MIMETypeHTMLUTF8)
	w.Write(content)
}

// MustComplete executes the main view template with the specified data and panics if error occurs.
func (m *MasterPageManager) MustComplete(r *http.Request, lang string, d *MasterPageData, w http.ResponseWriter) {
	if d == nil {
		panic("Unexpected empty `MasterPageData` in `MustComplete`")
	}
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
	d.AppForumsMode = m.config.Setup.ForumsMode

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
	user := appcom.ContextUser(ctx)
	if user != nil {
		d.AppUserID = user.EID
		d.AppUserName = user.Name
		d.AppUserIconURL = user.IconURL
		d.AppUserURL = user.URL
		d.AppUserAdmin = user.Admin
	}

	m.masterView.MustExecute(lang, w, d)
}

// MustError executes the main view template with the specified data and panics if error occurs.
func (m *MasterPageManager) MustError(r *http.Request, lang string, err error, expected bool, w http.ResponseWriter) HTML {
	d := &ErrorPageData{Message: err.Error()}
	// Handle unexpected errors
	if !expected {
		if err == sql.ErrNoRows {
			// Consider `sql.ErrNoRows` as 404 not found error
			w.WriteHeader(http.StatusNotFound)
			// Set `expected` to `true`
			expected = true

			d.Message = m.Dictionary(lang).ResourceNotFound
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
	htmlData := NewMasterPageData(m.Dictionary(lang).ErrOccurred, errorHTML)
	m.MustComplete(r, lang, htmlData, w)
	return HTML(0)
}

// PageTitle returns the given string followed by the localized site name.
func (m *MasterPageManager) PageTitle(lang, s string) string {
	return s + " - " + m.LocalizationManager.Dictionary(lang).SiteName
}

// MustParseLocalizedView creates a new LocalizedView with the given relative path.
func (m *MasterPageManager) MustParseLocalizedView(relativePath string) *LocalizedView {
	file := filepath.Join(m.dir, relativePath)
	view := templatex.MustParseView(file, m.reloadViewsOnRefresh)
	return &LocalizedView{view: view, localizationManager: m.LocalizationManager}
}

// MustParseView creates a new View with the given relative path.
func (m *MasterPageManager) MustParseView(relativePath string) *templatex.View {
	file := filepath.Join(m.dir, relativePath)
	return templatex.MustParseView(file, m.reloadViewsOnRefresh)
}

// Dictionary returns a localized dictionary with the specified language ID.
func (m *MasterPageManager) Dictionary(lang string) *localization.Dictionary {
	return m.LocalizationManager.Dictionary(lang)
}