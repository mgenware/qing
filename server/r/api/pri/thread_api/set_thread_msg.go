package composeapi

import (
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func setThreadMsg(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.GetIDFromDict(params, "id")
	threadID := validator.MustGetIDFromDict(params, "threadID")
	hasID := id != 0
	contentDict := validator.MustGetDictFromDict(params, "content")

	contentHTML, sanitizedToken := app.Service.Sanitizer.Sanitize(validator.MustGetTextFromDict(contentDict, "contentHTML"))

	var err error
	if !hasID {
		// Add a new entry.
		capt := validator.MustGetStringFromDict(contentDict, "captcha", defs.Constants.MaxCaptchaLen)
		captResult, err := app.Service.Captcha.Verify(uid, defs.Constants.EntityThread, capt, app.Config.DevMode())
		app.PanicIfErr(err)
		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}
		insertedID, err := da.ThreadMsg.InsertItem(app.DB, contentHTML, uid, threadID, sanitizedToken, captResult)
		app.PanicIfErr(err)
		id = insertedID
	} else {
		// Edit an existing entry.
		err = da.ThreadMsg.EditItem(app.DB, id, uid, contentHTML, sanitizedToken)
		app.PanicIfErr(err)
	}
	return resp.MustComplete(nil)
}
