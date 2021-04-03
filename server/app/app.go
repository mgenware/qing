/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package app

import (
	"fmt"
	"qing/app/appConfig"
	"qing/app/appLog"
	"qing/app/config/configs"
	"qing/app/extern"
	"qing/app/handler"
	"qing/app/servicex"
	"qing/app/urlx"
	"qing/app/userx"

	"qing/app/logx"
)

// Config is the configuration data loaded from `--config`.
var Config *cfg.Config

// AppProfile contains data generated by app at runtime.
var AppProfile *cfg.AppProfile

// MainPageManager is an app-wide instance of handler.MainPageManager.
var MainPageManager *handler.MainPageManager

// Logger is the main logger for this app.
var Logger *logx.Logger

// URL helps generate URLs.
var URL *urlx.URL

// Extern manages external dependencies, e.g. redis.
var Extern *extern.Extern

// UserManager manages user-related logic, e.g. user authentication.
var UserManager *userx.UserManager

// Service contains independent components for some curtain tasks, e.g. image processing, HTML sanitization.
var Service *servicex.Service

// PanicIfErr panics if the given `err` is not nil.
func PanicIfErr(err error) {
	if err != nil {
		panic(err)
	}
}

// SetupConfig returns config.SetupConfig.
func SetupConfig() *configs.SetupConfig {
	return Config.Setup
}

func init() {
	Config = appConfig.Get()
	mustSetupAppProfile()
	mustSetupLogger()
	mustSetupTemplates(Config)
	mustSetupURL()
	mustSetupExtern()
	mustSetupUserManager()
	mustSetupService()
}

func mustSetupAppProfile() {
	appProfile, err := cfg.GetAppProfile(Config.AppProfile.Dir)
	if err != nil {
		panic(fmt.Errorf("Error getting app profile, %v", err))
	}
	AppProfile = appProfile
}

func mustSetupLogger() {
	Logger = appLog.Get()
}

func mustSetupTemplates(config *cfg.Config) {
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
	UserManager = userx.NewUserManager(DB, sessionMgr, MainPageManager, URL, SetupConfig().ForumsMode, Config.Debug)
}

func mustSetupService() {
	service := servicex.MustNewService(Config, AppProfile, Extern, Logger, Extern.RedisConn)
	Service = service
}
