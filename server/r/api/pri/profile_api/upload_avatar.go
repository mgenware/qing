/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/appUserManager"
	"qing/a/appcom"
	"qing/a/defs"
	"qing/da"
	"qing/lib/iolib"
	"qing/s/avatar"

	"github.com/mgenware/goutil/strconvx"
)

const (
	errUnsupportedExt = 10
	errNoHeaderFound  = 11
	errFileTooLarge   = 12
	errParams         = 13
	maxUploadSize     = 5 * 1024 * 1024 // 5 MB max size.
)

type avatarUpdateResult struct {
	IconL string `json:"iconL"`
	IconS string `json:"iconS"`
}

type avatarCropInfo struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

func uploadAvatar(w http.ResponseWriter, r *http.Request) {
	resp := appHandler.JSONResponse(w, r)

	if r.ContentLength > maxUploadSize {
		resp.MustFailWithCode(errFileTooLarge)
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	err := r.ParseMultipartForm(1024 * 50) // 50kb
	if err != nil {
		resp.MustFail(err)
		return
	}
	var cropInfo *avatarCropInfo

	// Retrieve crop info.
	x, _ := strconvx.ParseInt(r.FormValue("x"))
	y, _ := strconvx.ParseInt(r.FormValue("y"))
	width, _ := strconvx.ParseInt(r.FormValue("width"))
	height, _ := strconvx.ParseInt(r.FormValue("height"))

	// If any crop params are wrong, we assume no crop info received.
	if x >= 0 && y >= 0 && width > 0 && height > 0 {
		cropInfo = &avatarCropInfo{X: x, Y: y, Width: width, Height: height}
	} else {
		resp.MustFailWithCode(errParams)
		return
	}

	form := r.MultipartForm
	headers := form.File[defs.Shared.FormUploadMain]
	if headers == nil || len(headers) == 0 {
		resp.MustFailWithCode(errNoHeaderFound)
		return
	}

	fileHeader := headers[0]
	isImg, ext := iolib.IsImageFile(fileHeader.Filename)
	if !isImg {
		resp.MustFailWithCode(errUnsupportedExt)
		return
	}

	srcReader, err := fileHeader.Open()
	if err != nil {
		resp.MustFail(err)
		return
	}
	defer srcReader.Close()

	user := appcom.ContextUser(resp.Context())
	uid := user.ID

	avatarName, err := avatar.Get().UpdateAvatar(user.IconName, srcReader, cropInfo.X, cropInfo.Y, cropInfo.Width, cropInfo.Height, uid, ext)
	if err != nil {
		resp.MustFail(err)
		return
	}

	// Update DB.
	err = da.User.UpdateIconName(appDB.DB(), uid, avatarName)
	if err != nil {
		resp.MustFail(err)
		return
	}

	// Update session.
	user.IconName = avatarName
	sid := appcom.ContextSID(resp.Context())
	err = appUserManager.Get().UpdateUserSession(sid, user)
	if err != nil {
		resp.MustFail(err)
		return
	}

	apiRes := &avatarUpdateResult{}
	apiRes.IconL = appURL.Get().UserIconURL(uid, avatarName, avatar.AvatarSize250)
	apiRes.IconS = appURL.Get().UserIconURL(uid, avatarName, avatar.AvatarSize50)
	resp.MustComplete(apiRes)
}
