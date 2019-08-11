package captchaAPI

import (
	"net/http"
	"qing/app"

	"github.com/mgenware/v5/go-packagex/httpx"
	"github.com/mgenware/v5/go-packagex/strconvx"
)

func CaptGET(w http.ResponseWriter, r *http.Request) {
	bid, err := strconvx.ParseUint(r.FormValue("bid"))
	ctx := r.Context()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !app.Service.Captcha.IsTypeAllowed(bid) {
		http.Error(w, "Invalid bid", http.StatusInternalServerError)
		return
	}

	httpx.SetResponseContentType(w, httpx.MIMETypePNG)
	code := captsvc.NewCaptcha(5)
	uid := session.UserIDFromCTX(ctx)
	if uid == 0 {
		http.Error(w, "Invalid uid", http.StatusInternalServerError)
		return
	}

	err = captsvc.WriteNewCaptcha(code, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
