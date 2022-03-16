/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package avatar

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"qing/a/app"
	"qing/a/appLog"
	"qing/a/def"
	"qing/lib/clib"
	"qing/lib/iolib"
	"qing/lib/randlib"
	"qing/s/imgproxy"
	"strconv"

	"github.com/mgenware/goutil/iox"
)

const (
	AvatarSize50         = 50
	AvatarSize150        = 150
	AvatarSize250        = 250
	TempOriginalFileName = "temp_original"
)

var resizedSizes = []int{AvatarSize250, AvatarSize150, AvatarSize50}

type AvatarService struct {
	OutDir string
	Logger app.CoreLogger
}

var service *AvatarService

func init() {
	conf := app.CoreConfig()
	svc, err := newService(filepath.Join(conf.ResServer.Dir, def.AvatarResKey))
	app.PanicIfErr(err)
	service = svc
}

func Get() *AvatarService {
	return service
}

func newService(outDir string) (*AvatarService, error) {
	s := &AvatarService{}
	if !filepath.IsAbs(outDir) {
		return nil, (fmt.Errorf("Avatar service `outDir` must be an absolute path, got \"%v\"", outDir))
	}
	appLog.Get().Info("avatar-service.starting", "path", outDir)
	s.OutDir = outDir
	return s, nil
}

func (svc *AvatarService) prepareUserFolder(uid uint64) (string, error) {
	dir := fmt.Sprintf("/%v/%v", svc.OutDir, clib.EncodeID(uid))
	err := iox.Mkdirp(dir)
	if err != nil {
		return "", err
	}
	return dir, nil
}

func (svc *AvatarService) tempOriginalPath(userDir, ext string) string {
	return filepath.Join(userDir, TempOriginalFileName+ext)
}

func (svc *AvatarService) avatarFilePath(userDir string, size int, avatarName string) string {
	return filepath.Join(userDir, strconv.Itoa(size)+"_"+avatarName)
}

// UpdateAvatar updates the given user's avatar with the specified source reader. It returns the updated avatar file name.
func (svc *AvatarService) UpdateAvatar(oldAvatarName string, srcReader io.Reader, x, y, width, height int, uid uint64, ext string) (string, error) {
	dir, err := svc.prepareUserFolder(uid)
	if err != nil {
		return "", err
	}

	tmpOriginPath := svc.tempOriginalPath(dir, ext)
	err = iolib.CopyReaderToFile(srcReader, tmpOriginPath)
	if err != nil {
		return "", err
	}
	defer os.Remove(tmpOriginPath)
	err = imgproxy.Get().Crop(tmpOriginPath, tmpOriginPath, x, y, width, height)
	if err != nil {
		return "", err
	}

	avatarName := randlib.RandString(6) + ext
	for _, size := range resizedSizes {
		avatarFilePath := svc.avatarFilePath(dir, size, avatarName)
		err = imgproxy.Get().Resize(tmpOriginPath, avatarFilePath, size, size)
		if err != nil {
			return "", err
		}
	}

	// Clean up
	if oldAvatarName != "" {
		for _, size := range resizedSizes {
			oldAvatarFile := svc.avatarFilePath(dir, size, oldAvatarName)
			err := os.Remove(oldAvatarFile)
			if err != nil {
				appLog.Get().Error("Error removing old avatar files: ", err.Error())
			}
		}
	}
	return avatarName, nil
}

func (svc *AvatarService) copyStringArray(arr []string) []string {
	dest := make([]string, len(arr))
	copy(dest, arr)
	return dest
}
