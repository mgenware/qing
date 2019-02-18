package app

import (
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"qing/app/config"
	"qing/app/template"
)

// Config is the application configuration loaded.
var Config *config.Config

// TemplateManager is a app-wide instance of template.Manager.
var TemplateManager *template.Manager

// HTMLResponse returns common objects used to compose an HTML response.
func HTMLResponse(w http.ResponseWriter, r *http.Request) *template.HTMLResponse {
	ctx := r.Context()
	tm := TemplateManager
	resp := template.NewHTMLResponse(ctx, tm, w)

	return resp
}

// JSONResponse returns common objects used to compose an HTML response.
func JSONResponse(w http.ResponseWriter, r *http.Request) *template.JSONResponse {
	ctx := r.Context()
	tm := TemplateManager
	resp := template.NewJSONResponse(ctx, tm, w, !Config.IsProduction)

	return resp
}

// MasterPageData wraps a call to MasterPageData.
func MasterPageData(title, contentHTML string) *template.MasterPageData {
	return template.NewMasterPageData(title, contentHTML)
}

func init() {
	mustSetupConfig()
	mustSetupTemplates(Config)
}

func mustSetupConfig() {
	// Parse command-line arguments
	var configPath string
	flag.StringVar(&configPath, "config", "", "path of application config file")
	flag.Parse()

	if configPath == "" {
		// If --config is not specified, check if user runs "go run main.go dev" which will read ./configs/dev.json as config file
		userArgs := os.Args[1:]
		if len(userArgs) == 1 && userArgs[0] == "dev" {
			configPath = "./configs/dev.json"
		} else {
			flag.PrintDefaults()
			os.Exit(1)
		}
	}

	// Read config file
	configBytes, err := ioutil.ReadFile(configPath)
	if err != nil {
		panic(err)
	}
	config, err := config.ReadConfig(configBytes)
	if err != nil {
		panic(err)
	}

	log.Printf("✅ Loaded config at \"%v\"", configPath)
	if !config.IsProduction {
		log.Printf("⚠️ Application running in dev mode")
	}
	Config = config
}

func mustSetupTemplates(c *config.Config) {
	templatesConfig := c.Templates
	localizationConfig := c.Localization

	TemplateManager = template.MustCreateManager(templatesConfig.RootDir, !c.IsProduction, localizationConfig.RootDir, localizationConfig.DefaultLang)
}
