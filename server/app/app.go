package app

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"qing/app/extern"
	"qing/app/handler"
	"qing/app/handler/assetmgr"
	"qing/app/servicex"
	"qing/app/urlx"
	"qing/app/userx"

	"qing/app/cfg"
	"qing/app/logx"

	// Load MySQL driver
	_ "github.com/go-sql-driver/mysql"
)

// Config is the configuration data loaded from `--config`.
var Config *cfg.Config

// AppProfile contains data generated by app at runtime.
var AppProfile *cfg.AppProfile

// TemplateManager is an app-wide instance of handler.Manager.
var TemplateManager *handler.Manager

// Logger is the main logger for this app.
var Logger *logx.Logger

// URL helps generate URLs.
var URL *urlx.URL

// DB is the app-wide database connection.
var DB *sql.DB

// Extern manages external dependencies, e.g. redis.
var Extern *extern.Extern

// UserManager manages user-related logic, e.g. user authentication.
var UserManager *userx.UserManager

// Service contains independent components for some curtain tasks, e.g. image processing, HTML sanitization.
var Service *servicex.Service

// HTMLResponse returns common objects used to compose an HTML response.
func HTMLResponse(w http.ResponseWriter, r *http.Request) *handler.HTMLResponse {
	tm := TemplateManager
	resp := handler.NewHTMLResponse(r, tm, w)

	return resp
}

// JSONResponse returns common objects used to compose an HTML response.
func JSONResponse(w http.ResponseWriter, r *http.Request) *handler.JSONResponse {
	tm := TemplateManager
	resp := handler.NewJSONResponse(r, tm, w)

	return resp
}

// PanicIfErr panics if the given `err` is not nil.
func PanicIfErr(err error) {
	if err != nil {
		panic(err)
	}
}

// MasterPageData wraps a call to MasterPageData.
func MasterPageData(title, contentHTML string) *handler.MasterPageData {
	return handler.NewMasterPageData(title, contentHTML)
}

func init() {
	mustSetupConfig()
	mustSetupAppProfile()
	mustSetupLogger()
	mustSetupTemplates(Config)
	mustSetupDB()
	mustSetupURL()
	mustSetupExtern()
	mustSetupUserManager()
	mustSetupService()
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
	config, err := cfg.ReadConfig(configPath)
	if err != nil {
		panic(fmt.Errorf("Error reading config file, %v", err))
	}

	log.Printf("✅ Loaded config at \"%v\"", configPath)
	if config.DevMode() {
		log.Printf("⚠️ Application running in dev mode")
	}
	Config = config
}

func mustSetupAppProfile() {
	appProfile, err := cfg.GetAppProfile(Config.AppProfile.Dir)
	if err != nil {
		panic(fmt.Errorf("Error getting app profile, %v", err))
	}
	AppProfile = appProfile
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

func mustSetupTemplates(config *cfg.Config) {
	templatesConfig := config.Templates
	localizationConfig := config.Localization
	assMgr := assetmgr.NewAssetsManager(Config.HTTP.Static.Dir, Config.Debug != nil)
	TemplateManager = handler.MustCreateManager(templatesConfig.Dir, localizationConfig.Dir, localizationConfig.DefaultLang, assMgr, Logger, config)
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
	sessionMgr, err := userx.NewRedisBasedSessionManager(Extern.RedisConn,
		Logger, URL)
	if err != nil {
		panic(err)
	}
	UserManager = userx.NewUserManager(DB, sessionMgr, TemplateManager, URL, Config.Debug)
}

func mustSetupService() {
	service := servicex.MustNewService(Config, AppProfile, Extern, Logger, Extern.RedisConn)
	Service = service
}
