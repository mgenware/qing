/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

// APIResult contains the information about the return value of an API, which is either success or failure.
type APIResult struct {
	// Code indicates the status code of this result. 0 means success.
	Code int `json:"code,omitempty"`

	// Message is the result of Error.Error().
	Message string `json:"message,omitempty"`

	// Data represents the requested value in a successful result.
	Data interface{} `json:"d,omitempty"`

	// Error holds the internal go error object of this result.
	Error error `json:"-"`
}
