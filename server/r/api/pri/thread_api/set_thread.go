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

func setThread(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.GetIDFromDict(params, "id")
	hasID := id != 0

	contentDict := validator.MustGetDictFromDict(params, "content")
	title := validator.MustGetStringFromDict(contentDict, "title", defs.Constants.MaxPostTitleLen)

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
		insertedID, err := da.Thread.InsertItem(app.DB, title, contentHTML, uid, sanitizedToken, captResult)
		app.PanicIfErr(err)
		id = insertedID
	} else {
		// Edit an existing entry.
		err = da.Thread.EditItem(app.DB, id, uid, title, contentHTML, sanitizedToken)
		app.PanicIfErr(err)
	}

	newThreadURL := app.URL.Thread(id)
	return resp.MustComplete(newThreadURL)
}
