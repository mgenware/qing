package captchaapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"

	"github.com/mgenware/go-packagex/v5/httpx"
	"github.com/mgenware/go-packagex/v5/strconvx"
)

// CaptchaGET handles captcha requests.
func CaptchaGET(w http.ResponseWriter, r *http.Request) {
	bid, err := strconvx.ParseInt(r.FormValue("bid"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if !app.Service.Captcha.IsTypeAllowed(bid) {
		http.Error(w, "Invalid bid", http.StatusBadRequest)
		return
	}

	ctx := r.Context()
	uid := cm.ContextUserID(ctx)
	if uid == 0 {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	httpx.SetResponseContentType(w, httpx.MIMETypePNG)

	err = app.Service.Captcha.WriteCaptcha(uid, bid, 5, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
