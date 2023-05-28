/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"fmt"
	"net/http"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/appURL"
	"qing/a/appUserManager"
	"qing/a/appcm"
	"qing/a/def/appDef"
	"qing/da"
	"qing/lib/iolib"
	"qing/s/avatar"

	strf "github.com/mgenware/go-string-format"
	"github.com/mgenware/goutil/strconvx"
)

const (
	maxUploadSize = 5 * 1024 * 1024 // 5 MB max size.
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
		resp.MustFail(strf.Format(resp.LS().PFileSizeExceedsMaxSize, "5 MB"))
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	err := r.ParseMultipartForm(1024 * 50) // 50kb
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error parsing multipart form: %v", err))
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
		resp.MustFail("Invalid params")
		return
	}

	form := r.MultipartForm
	headers := form.File[appDef.FormUploadMain]
	if len(headers) == 0 {
		resp.MustFail("No header found")
		return
	}

	fileHeader := headers[0]
	isImg, ext := iolib.IsImageFile(fileHeader.Filename)
	if !isImg {
		resp.MustFail(resp.LS().UnsupportedExtension)
		return
	}

	srcReader, err := fileHeader.Open()
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error opening file header: %v", err))
		return
	}
	defer srcReader.Close()

	user := appcm.ContextUser(resp.Context())
	uid := user.ID

	avatarName, err := avatar.Get().UpdateAvatar(user.IconName, srcReader, cropInfo.X, cropInfo.Y, cropInfo.Width, cropInfo.Height, uid, ext)
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error updating avatar: %v", err))
		return
	}

	// Update DB.
	err = da.User.UpdateIconName(appDB.DB(), uid, avatarName)
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error updating icon: %v", err))
		return
	}

	// Update session.
	user.IconName = avatarName
	sid := appcm.ContextSID(resp.Context())
	err = appUserManager.Get().UpdateUserSession(sid, user)
	if err != nil {
		resp.MustFail(fmt.Sprintf("Error updating user session: %v", err))
		return
	}

	apiRes := &avatarUpdateResult{}
	apiRes.IconL = appURL.Get().UserIconURL(uid, avatarName, avatar.AvatarSize250)
	apiRes.IconS = appURL.Get().UserIconURL(uid, avatarName, avatar.AvatarSize50)
	resp.MustComplete(apiRes)
}
