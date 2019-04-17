package profilec

import (
	"context"
	"io"
	"net/http"
	"os"
	"qing/app"
	"qing/app/cm"
	"qing/da"
	"qing/fx/avatar"
	"qing/lib/io2"

	"github.com/mgenware/go-packagex/v5/filepathx"
)

const (
	errUnsupportedExt = 10
	errNoHeaderFound  = 11
	errFileTooLarge   = 12
	maxUploadSize     = 5 * 1024 * 1024 //5mb max size
)

type avatarUpdateResult struct {
	IconL string `json:"iconL"`
	IconS string `json:"iconS"`
}

func uploadAvatar(w http.ResponseWriter, r *http.Request) {
	resp := app.JSONResponse(w, r)

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
	form := r.MultipartForm
	headers := form.File["main"]
	if headers == nil || len(headers) == 0 {
		resp.MustFailWithCode(errNoHeaderFound)
		return
	}

	fileHeader := headers[0]
	isImg, ext := io2.IsImagePath(fileHeader.Filename)
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
	// copy reader to a temp file
	tmpPath := filepathx.TempFilePath(ext, "avatar-srv")
	tmpFile, err := os.Create(tmpPath)
	if err != nil {
		resp.MustFail(err)
		return
	}

	defer tmpFile.Close()
	defer os.Remove(tmpFile.Name())

	_, err = io.Copy(tmpFile, srcFile)
	if err != nil {
		resp.MustFail(err)
		return
	}

	uid, avatarName, err := updateAvatarFromFile(resp.Context(), tmpFile.Name())
	if err != nil {
		resp.MustFail(err)
		return
	}

	apiRes := &avatarUpdateResult{}
	apiRes.IconL = app.URL.UserAvatarURL(uid, avatarName, avatar.AvatarSize250)
	apiRes.IconS = app.URL.UserAvatarURL(uid, avatarName, avatar.AvatarSize50)
	resp.MustComplete(apiRes)
}

func updateAvatarFromFile(ctx context.Context, file string) (uint64, string, error) {
	user := cm.ContextUser(ctx)
	uid := user.ID
	curAvatarName, err := da.User.SelectIconName(app.DB, uid)
	if err != nil {
		return 0, "", err
	}
	// remove old avatar files
	if curAvatarName != "" {
		app.Service.Avatar.RemoveAvatarFiles(uid, curAvatarName)
	}

	avatarName, err := app.Service.Avatar.SaveAvatarFromFile(file, uid)
	if err != nil {
		return 0, "", err
	}

	// Update DB
	err = da.User.UpdateIconName(app.DB, uid, avatarName)
	if err != nil {
		return 0, "", err
	}

	// Update session
	user.IconName = avatarName
	sid := cm.ContextSID(ctx)
	err = app.UserManager.SessionManager.SetUserSession(sid, user)
	if err != nil {
		return 0, "", err
	}
	return uid, avatarName, nil
}
