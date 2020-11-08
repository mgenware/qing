package authapi

import (
	"database/sql"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func signIn(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())

	email := validator.MustGetStringFromDict(params, "email", defs.Constants.MaxUserEmailLen)
	pwd := validator.MustGetStringFromDict(params, "pwd", defs.Constants.MaxUserPwdLen)

	// Verify user ID.
	uid, err := da.User.SelectIDFromEmail(app.DB, email)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFailWithCode(defs.Constants.ErrInvalidUserOrPwd)
		}
		return resp.MustFail(err)
	}
	if uid == 0 {
		panic("signInPOST: UserID is 0")
	}

	// Verify password.
	hash, err := da.UserPwd.SelectHashByID(app.DB, uid)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFailWithCode(defs.Constants.ErrInvalidUserOrPwd)
		}
		return resp.MustFail(err)
	}

	pwdValid, err := app.Service.HashingAlg.ComparePasswordAndHash(pwd, hash)
	if err != nil {
		return resp.MustFail(err)
	}
	if !pwdValid {
		return resp.MustFailWithCode(defs.Constants.ErrInvalidUserOrPwd)
	}

	user, err := app.UserManager.CreateUserSessionFromUID(uid)
	if err != nil {
		panic(err.Error())
	}

	err = app.UserManager.SessionManager.Login(w, r, user)
	if err != nil {
		panic(err.Error())
	}
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	return handler.JSON(0)
}
