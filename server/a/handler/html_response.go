/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"errors"
	"net/http"
	"qing/a/handler/localization"
)

// HTMLResponse helps you create a HTTP response in HTML with MainPageData.
type HTMLResponse struct {
	BaseResponse

	writer      http.ResponseWriter
	mainPageMgr CorePageManager
	isCompleted bool
}

// HTML is a dummy type returned by HTTPResponse to make sure response is completed.
type HTML = int

// NewHTMLResponse creates a new HTMLResponse.
func NewHTMLResponse(r *http.Request, mainPageMgr CorePageManager, wr http.ResponseWriter) *HTMLResponse {
	return &HTMLResponse{
		BaseResponse: newBaseResponse(r),
		mainPageMgr:  mainPageMgr,
		writer:       wr,
	}
}

// MustCompleteWithContent finished the response with the given HTML content.
func (h *HTMLResponse) MustCompleteWithContent(content string, w http.ResponseWriter) HTML {
	h.checkCompletion()
	h.mainPageMgr.MustCompleteWithContent([]byte(content), w)
	return HTML(0)
}

// MustComplete finishes the response with the given MainPageData, and panics if unexpected error happens.
func (h *HTMLResponse) MustComplete(d *MainPageData) HTML {
	h.checkCompletion()
	h.mainPageMgr.MustComplete(h.Request(), h.lang, http.StatusOK, d, h.writer)
	return HTML(0)
}

// MustFail finishes the response with the given error object.
func (h *HTMLResponse) MustFail(err error, statusCode int) HTML {
	h.MustFailWithError(err, statusCode)
	return HTML(0)
}

// MustFailWithError finishes the response with the given error and `expected` arguments, and panics if unexpected error happens.
func (h *HTMLResponse) MustFailWithError(err error, statusCode int) HTML {
	h.checkCompletion()
	h.mainPageMgr.MustError(h.Request(), h.lang, err, statusCode, h.writer)
	return HTML(0)
}

// LocalizedDictionary returns the dictionary associated with current language ID.
func (h *HTMLResponse) LocalizedDictionary() *localization.Dictionary {
	return h.mainPageMgr.Dictionary(h.Lang())
}

// PageTitle calls MainPageManager.PageTitle.
func (h *HTMLResponse) PageTitle(s string) string {
	return h.mainPageMgr.PageTitle(h.lang, s)
}

// Redirect calls http.Redirect.
func (h *HTMLResponse) Redirect(url string, code int) HTML {
	http.Redirect(h.writer, h.req, url, code)
	return HTML(0)
}

func (h *HTMLResponse) checkCompletion() {
	if h.isCompleted {
		panic(errors.New("Result has completed"))
	}
	h.isCompleted = true
}
