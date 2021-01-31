package app

import (
	"net/http"
	"qing/app/handler"
)

// HTMLResponse returns common objects used to compose an HTML response.
func HTMLResponse(w http.ResponseWriter, r *http.Request) *handler.HTMLResponse {
	tm := MainPageManager
	resp := handler.NewHTMLResponse(r, tm, w)
	return resp
}

// JSONResponse returns common objects used to compose an HTML response.
func JSONResponse(w http.ResponseWriter, r *http.Request) *handler.JSONResponse {
	resp := handler.NewJSONResponse(r, w)
	return resp
}

// MainPageData wraps a call to MainPageData.
func MainPageData(title, contentHTML string) *handler.MainPageData {
	return handler.NewMainPageData(title, contentHTML)
}
