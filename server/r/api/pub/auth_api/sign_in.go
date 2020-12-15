package authapi

import (
	"database/sql"
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
)

func signIn(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := app.ContextDict(r)

	email := validator.MustGetStringFromDict(params, "email", defs.Shared.MaxUserEmailLen)
	pwd := validator.MustGetStringFromDict(params, "pwd", defs.Shared.MaxUserPwdLen)

	// Verify user ID.
	uid, err := da.User.SelectIDFromEmail(app.DB, email)
	if err != nil {
		if err == sql.ErrNoRows {
			return resp.MustFailWithCode(defs.Shared.ErrInvalidUserOrPwd)
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
			return resp.MustFailWithCode(defs.Shared.ErrInvalidUserOrPwd)
		}
		return resp.MustFail(err)
	}

	pwdValid, err := app.Service.HashingAlg.ComparePasswordAndHash(pwd, hash)
	if err != nil {
		return resp.MustFail(err)
	}
	if !pwdValid {
		return resp.MustFailWithCode(defs.Shared.ErrInvalidUserOrPwd)
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
