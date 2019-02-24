package errorPage

import (
	"errors"
	"net/http"

	"qing/app"
)

// FakeErrorGET is the GET handler for "/fakeError"
func FakeErrorGET(w http.ResponseWriter, r *http.Request) {
	resp := app.HTMLResponse(w, r)
	err := errors.New("🐒 This is a demo error page")

	resp.MustFail(err)
}
