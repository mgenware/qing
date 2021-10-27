/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profileapi

import (
	"context"
	"net/http"
	"qing/app/appDB"
	"qing/app/appHandler"
	"qing/app/appURL"
	"qing/app/appUserManager"
	"qing/app/appcom"
	"qing/app/defs"
	"qing/da"
	"qing/lib/iolib"
	"qing/s/avatar"
	"qing/s/imgproxy"
	"qing/s/tmp"

	"github.com/mgenware/go-packagex/v6/strconvx"
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
	headers := form.File["avatarMain"]
	if headers == nil || len(headers) == 0 {
		resp.MustFailWithCode(errNoHeaderFound)
		return
	}

	fileHeader := headers[0]
	isImg, ext := iolib.IsImagePath(fileHeader.Filename)
	if !isImg {
		resp.MustFailWithCode(errUnsupportedExt)
		return
	}

	srcFile, err := fileHeader.Open()
	if err != nil {
		resp.MustFail(err)
		return
	}
	defer srcFile.Close()

	// Copy reader content to a temp file.
	tmpImgFile, err := tmp.NewFile(defs.TmpFileAvatarUpload, ext)
	if err != nil {
		resp.MustFail(err)
		return
	}
	err = iolib.CopyReaderToFile(srcFile, tmpImgFile.PhysicalPath())
	if err != nil {
		resp.MustFail(err)
		return
	}
	defer tmpImgFile.Delete()

	// Crop the image if necessary.
	if cropInfo != nil {
		err = imgproxy.Get().Crop(tmpImgFile.VolumePath(), tmpImgFile.PhysicalPath(), cropInfo.X, cropInfo.Y, cropInfo.Width, cropInfo.Height)
		if err != nil {
			resp.MustFail(err)
			return
		}
	}

	uid, avatarName, err := updateAvatarFromVolumeFile(resp.Context(), tmpImgFile.VolumePath())
	if err != nil {
		resp.MustFail(err)
		return
	}

	apiRes := &avatarUpdateResult{}
	apiRes.IconL = appURL.Get().UserIconURL(uid, avatarName, avatar.AvatarSize250)
	apiRes.IconS = appURL.Get().UserIconURL(uid, avatarName, avatar.AvatarSize50)
	resp.MustComplete(apiRes)
}

func updateAvatarFromVolumeFile(ctx context.Context, file string) (uint64, string, error) {
	user := appcom.ContextUser(ctx)
	uid := user.ID
	curAvatarName, err := da.User.SelectIconName(appDB.DB(), uid)
	if err != nil {
		return 0, "", err
	}
	// Remove old avatar files.
	if curAvatarName != "" {
		avatar.Get().RemoveAvatarFiles(uid, curAvatarName)
	}

	avatarName, err := avatar.Get().SetAvatarFromVolumeFile(file, uid)
	if err != nil {
		return 0, "", err
	}

	// Update DB.
	err = da.User.UpdateIconName(appDB.DB(), uid, avatarName)
	if err != nil {
		return 0, "", err
	}

	// Update session.
	user.IconName = avatarName
	sid := appcom.ContextSID(ctx)
	err = appUserManager.Get().UpdateUserSession(sid, user)
	if err != nil {
		return 0, "", err
	}
	return uid, avatarName, nil
}
