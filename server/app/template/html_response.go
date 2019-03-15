package template

import (
	"errors"
	"net/http"
)

// HTMLResponse helps you create a HTTP response in HTML with MasterPageData.
type HTMLResponse struct {
	BaseResponse

	writer      http.ResponseWriter
	isCompleted bool
}

// NewHTMLResponse creates a new HTMLResponse.
func NewHTMLResponse(r *http.Request, mgr *Manager, wr http.ResponseWriter) *HTMLResponse {
	return &HTMLResponse{
		BaseResponse: newBaseResponse(r, mgr),
		writer:       wr,
	}
}

// MustCompleteWithContent finished the response with the given HTML content.
func (h *HTMLResponse) MustCompleteWithContent(content string, w http.ResponseWriter) {
	h.checkCompletion()
	h.mgr.MustCompleteWithContent([]byte(content), w)
}

// MustComplete finishes the response with the given MasterPageData, and panics if unexpected error happens.
func (h *HTMLResponse) MustComplete(d *MasterPageData) {
	h.checkCompletion()
	h.mgr.MustComplete(h.Request(), h.lang, d, h.writer)
}

// MustFail finishes the response with the given error object.
func (h *HTMLResponse) MustFail(err error) {
	h.MustFailWithError(err, false)
}

// MustFailWithError finishes the response with the given error and `expected` arguments, and panics if unexpected error happens.
func (h *HTMLResponse) MustFailWithError(err error, expected bool) {
	h.checkCompletion()
	h.mgr.MustError(h.Request(), h.lang, err, expected, h.writer)
}

func (h *HTMLResponse) checkCompletion() {
	if h.isCompleted {
		panic(errors.New("Result has completed"))
	}
	h.isCompleted = true
}
