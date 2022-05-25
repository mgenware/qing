/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appLog

type TestLogger struct {
}

// NewTestLogger creates a new logger for testing.
func NewTestLogger() *TestLogger {
	return &TestLogger{}
}

// Info logs an info message.
func (logger *TestLogger) Info(key string, args ...any) {
}

// Warn logs a warning message.
func (logger *TestLogger) Warn(key string, args ...any) {
}

// Error logs an error message.
func (logger *TestLogger) Error(key string, args ...any) {
}

// NotFound logs an HTTP 404 message.
func (logger *TestLogger) NotFound(key string, url string) {
}
