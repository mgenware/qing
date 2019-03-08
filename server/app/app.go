package app

import (
	"database/sql"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"qing/app/extern"
	"qing/app/urlx"
	"qing/app/userx"

	"qing/app/config"
	"qing/app/logx"
	"qing/app/template"
	"qing/app/template/asset"

	_ "github.com/go-sql-driver/mysql"
)

// Config is the application configuration loaded.
var Config *config.Config

// TemplateManager is an app-wide instance of template.Manager.
var TemplateManager *template.Manager

// Logger is the main logger for this app.
var Logger *logx.Logger

// URL is a module to help generated URLs
var URL *urlx.URL

// DB is the app-wide database connection.
var DB *sql.DB

var Extern *extern.Extern
var UserManager *userx.UserManager

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
	resp := template.NewJSONResponse(ctx, tm, w, Config.Debug)

	return resp
}

// MasterPageData wraps a call to MasterPageData.
func MasterPageData(title, contentHTML string) *template.MasterPageData {
	return template.NewMasterPageData(title, contentHTML)
}

func init() {
	mustSetupConfig()
	mustSetupLogger()
	mustSetupTemplates(Config)
	mustSetupDB()
	mustSetupURL()
	mustSetupExtern()
	mustSetupUserManager()
}

func mustSetupConfig() {
	// Parse command-line arguments
	var configPath string
	flag.StringVar(&configPath, "config", "", "path of application config file")
	flag.Parse()

	if configPath == "" {
		// If --config is not specified, check if user has an extra argument like "go run main.go dev", which we consider it as --config "./config/dev.json"
		userArgs := os.Args[1:]
		if len(userArgs) >= 1 {
			configPath = fmt.Sprintf("./config/%v.json", userArgs[0])
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
	if config.DevMode() {
		log.Printf("⚠️ Application running in dev mode")
	}
	Config = config
}

func mustSetupLogger() {
	if Config == nil {
		panic("Config must be set before mustSetupLogger")
	}
	logger, err := logx.NewLogger(Config.Log.Dir, Config.DevMode())
	if err != nil {
		panic(err)
	}
	Logger = logger
}

func mustSetupTemplates(config *config.Config) {
	templatesConfig := config.Templates
	localizationConfig := config.Localization
	assMgr := asset.NewAssetsManager(Config.HTTP.Static.Dir, Config.Debug != nil)
	TemplateManager = template.MustCreateManager(templatesConfig.Dir, localizationConfig.Dir, localizationConfig.DefaultLang, assMgr, Logger, config.Debug)
}

func mustSetupDB() {
	if Config.DBConnString == "" {
		panic("Empty DBConnString in config")
	}
	conn, err := sql.Open("mysql", Config.DBConnString)
	if err != nil {
		panic(err)
	}
	DB = conn
}

func mustSetupURL() {
	URL = urlx.NewURL(Config)
}

func mustSetupExtern() {
	Extern = extern.MustSetupExtern(Config)
}

func mustSetupUserManager() {
	sessionMgr, err := userx.NewRedisBasedSessionManager(Extern.RedisConn.Pool(),
		Logger, URL)
	if err != nil {
		panic(err)
	}
	UserManager = userx.NewUserManager(DB, sessionMgr, TemplateManager, URL, Config.Debug)
}
