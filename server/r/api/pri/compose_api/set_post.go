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

func setPost(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())
	uid := resp.UserID()

	id := validator.GetIDFromDict(params, "id")
	hasID := id != 0
	destination := validator.MustGetIntFromDict(params, "destination")
	postType := validator.MustGetIntFromDict(params, "type")
	if postType == defs.Constants.ForumPostTypeQuestion {
		panic("Questions are WIP")
	}

	contentDict := validator.MustGetDictFromDict(params, "content")
	title := validator.MustGetStringFromDict(contentDict, "title", defs.Constants.MaxPostTitleLen)

	contentHTML, sanitizedToken := app.Service.Sanitizer.Sanitize(validator.MustGetTextFromDict(contentDict, "contentHTML"))

	var err error
	if !hasID {
		capt := validator.MustGetStringFromDict(contentDict, "captcha", 10)
		// New post
		captResult, err := app.Service.Captcha.Verify(uid, defs.Constants.EntityPost, capt, app.Config.DevMode())
		app.PanicIfErr(err)
		if captResult != 0 {
			return resp.MustFailWithCode(captResult)
		}

		var insertedID uint64
		if destination == defs.Constants.PostDestinationUser {
			insertedID, err = da.Post.InsertPost(app.DB, title, contentHTML, uid, sanitizedToken, captResult)
		} else {
			insertedID, err = da.Thread.InsertPost(app.DB, title, contentHTML, uid, sanitizedToken, captResult)
		}
		app.PanicIfErr(err)
		id = insertedID
	} else {
		// Edit post.
		if destination == defs.Constants.PostDestinationUser {
			err = da.Post.EditPost(app.DB, id, uid, title, contentHTML, sanitizedToken)
		} else {
			err = da.Thread.EditPost(app.DB, id, uid, title, contentHTML, sanitizedToken)
		}
		app.PanicIfErr(err)
	}

	newPostURL := app.URL.Post(id)
	return resp.MustComplete(newPostURL)
}
