package composeapi

import (
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func setPost(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.GetIDFromDict(params, "id")
	hasID := id != 0
	entityType := validator.MustGetIntFromDict(params, "entityType")

	contentDict := validator.MustGetDictFromDict(params, "content")
	title := validator.MustGetStringFromDict(contentDict, "title", defs.Constants.MaxPostTitleLen)

	contentHTML, sanitizedToken := app.Service.Sanitizer.Sanitize(validator.MustGetTextFromDict(contentDict, "contentHTML"))

	var err error
	var result interface{}
	db := app.DB
	if !hasID {
		// Add a new entry.
		capt := validator.MustGetStringFromDict(contentDict, "captcha", defs.Constants.MaxCaptchaLen)
		captResult, err := app.Service.Captcha.Verify(uid, defs.Constants.EntityPost, capt, app.Config.DevMode())
		app.PanicIfErr(err)
		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}

		switch entityType {
		case defs.Constants.EntityPost:
			{
				insertedID, err := da.Post.InsertItem(db, title, contentHTML, uid, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = app.URL.Post(insertedID)
				break
			}

		case defs.Constants.EntityThread:
			{
				insertedID, err := da.Thread.InsertItem(db, title, contentHTML, uid, sanitizedToken, captResult)
				app.PanicIfErr(err)

				result = app.URL.Thread(insertedID)
				break
			}

		case defs.Constants.EntityThreadMsg:
			{
				threadID := validator.GetIDFromDict(params, "threadID")
				_, err := da.ThreadMsg.InsertItem(db, contentHTML, uid, threadID, sanitizedToken, captResult)
				app.PanicIfErr(err)
				break
			}

		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	} else {
		// Edit an existing entry.
		switch entityType {
		case defs.Constants.EntityPost:
			{
				err = da.Post.EditItem(db, id, uid, title, contentHTML, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case defs.Constants.EntityThread:
			{
				err = da.Thread.EditItem(db, id, uid, title, contentHTML, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		case defs.Constants.EntityThreadMsg:
			{
				err = da.ThreadMsg.EditItem(db, id, uid, contentHTML, sanitizedToken)
				app.PanicIfErr(err)
				break
			}
		default:
			panic(fmt.Sprintf("Unsupported entity type %v", entityType))
		}
	}

	return resp.MustComplete(result)
}
