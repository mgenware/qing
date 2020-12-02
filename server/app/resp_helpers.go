package app

import (
	"net/http"
	"qing/app/handler"
)

// HTMLResponse returns common objects used to compose an HTML response.
func HTMLResponse(w http.ResponseWriter, r *http.Request) *handler.HTMLResponse {
	tm := MasterPageManager
	resp := handler.NewHTMLResponse(r, tm, w)
	return resp
}

// JSONResponse returns common objects used to compose an HTML response.
func JSONResponse(w http.ResponseWriter, r *http.Request) *handler.JSONResponse {
	resp := handler.NewJSONResponse(r, w)
	return resp
}

// MasterPageData wraps a call to MasterPageData.
func MasterPageData(title, contentHTML string) *handler.MasterPageData {
	return handler.NewMasterPageData(title, contentHTML)
}
