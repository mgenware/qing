/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package logx

import (
	"fmt"
	"log"
	"path/filepath"
	"runtime/debug"

	"github.com/fatih/color"
	"github.com/mgenware/goutil/iox"
	"github.com/mgenware/goutil/stringsx"
	"go.uber.org/zap"
)

// Logger logs data to different files based on log levels.
type Logger struct {
	Directory string
	DevMode   bool

	errLogger      *zap.SugaredLogger
	warningLogger  *zap.SugaredLogger
	infoLogger     *zap.SugaredLogger
	notFoundLogger *zap.Logger
}

// NewLogger creates a new logger.
func NewLogger(dir string, dev bool) (*Logger, error) {
	err := iox.Mkdirp(dir)
	if err != nil {
		return nil, err
	}

	logger := &Logger{Directory: dir}
	infoLogger, err := createLogger(dir, "info.log", dev, false)
	if err != nil {
		return nil, err
	}
	logger.infoLogger = infoLogger.Sugar()

	warningLogger, err := createLogger(dir, "warning.log", dev, false)
	if err != nil {
		return nil, err
	}
	logger.warningLogger = warningLogger.Sugar()

	errLogger, err := createLogger(dir, "error.log", dev, false)
	if err != nil {
		return nil, err
	}
	logger.errLogger = errLogger.Sugar()

	notFoundLogger, err := createLogger(dir, "not_found.log", dev, true)
	if err != nil {
		return nil, err
	}
	logger.notFoundLogger = notFoundLogger

	logger.DevMode = dev
	return logger, nil
}

// Info logs an info message.
func (logger *Logger) Info(key string, args ...interface{}) {
	if logger.DevMode {
		log.Println(formatOutputStr(key, args))
	}
	logger.infoLogger.Infow(key, args...)
}

// Warn logs a warning message.
func (logger *Logger) Warn(key string, args ...interface{}) {
	if logger.DevMode {
		log.Println(color.YellowString(formatOutputStr(key, args)))
	}
	logger.warningLogger.Warnw(key, args...)
}

// Error logs an error message.
func (logger *Logger) Error(key string, args ...interface{}) {
	if logger.DevMode {
		debug.PrintStack()
		log.Println(color.RedString(formatOutputStr(key, args)))
	}
	logger.errLogger.Errorw(key, args...)
}

// NotFound logs an HTTP 404 message.
func (logger *Logger) NotFound(key string, url string) {
	if logger.DevMode {
		log.Println(color.HiYellowString(fmt.Sprintf("⛔️ Not found: %v: %v", key, url)))
	}
	logger.notFoundLogger.Info(key, zap.String("url", url))
}

func createLogger(dir string, name string, dev bool, disableExtraInfo bool) (*zap.Logger, error) {
	cfg := zap.NewProductionConfig()
	cfg.Development = dev
	cfg.OutputPaths = []string{
		filepath.Join(dir, name),
	}
	cfg.ErrorOutputPaths = []string{"stderr"}
	if disableExtraInfo {
		cfg.DisableCaller = true
		cfg.DisableStacktrace = true
	}
	return cfg.Build()
}

func formatOutputStr(key string, args []interface{}) string {
	return fmt.Sprintf("✉️ %v: %v", key, stringsx.JoinAll(args, " | "))
}
