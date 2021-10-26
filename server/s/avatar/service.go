/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package avatar

import (
	"fmt"
	"log"
	"os"
	"path"
	"path/filepath"
	"qing/app"
	"qing/app/appConfig"
	"qing/app/appLog"
	"qing/app/defs"
	"qing/lib/randlib"
	"qing/s/imgproxy"
)

const (
	AvatarSize50  = 50
	AvatarSize150 = 150
	AvatarSize250 = 250
)

var resizedSizes = []int{AvatarSize250, AvatarSize150, AvatarSize50}

type AvatarService struct {
	OutDir string
	Logger app.CoreLog
}

var service *AvatarService

func init() {
	conf := appConfig.Get()
	svc, err := newService(path.Join(conf.ResServer.Dir, defs.AvatarResKey))
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

// GetAvatarFilePath returns the physical avatar file path.
func (svc *AvatarService) GetAvatarFilePath(uid uint64, size int, avatarName string) string {
	return fmt.Sprintf("/%v/%v/%v_%v", svc.OutDir, uid, size, avatarName)
}

// SetAvatarFromFile updates the given user's avatar with the specified file path.
func (svc *AvatarService) SetAvatarFromFile(src string, uid uint64) (string, error) {
	ext := path.Ext(src)
	avatarName := randlib.RandString(6) + ext
	for _, size := range resizedSizes {
		fileNameWithSize := fmt.Sprintf("%v_%v", size, avatarName)
		newfilepath, err := svc.allocFilepathForThumbnail(uid, fileNameWithSize)
		if err != nil {
			return "", err
		}
		err = imgproxy.Get().Resize(src, newfilepath, size, size)
		if err != nil {
			return "", err
		}
	}
	return avatarName, nil
}

// RemoveAvatarFiles deletes old avatar files of a specified user.
func (svc *AvatarService) RemoveAvatarFiles(uid uint64, avatarName string) {
	for _, size := range resizedSizes {
		file := fmt.Sprintf("%v/%v/%v_%v", svc.OutDir, uid, size, avatarName)
		err := os.Remove(file)
		if err != nil {
			log.Print("Error removing old avatar files: ", err.Error())
		}
	}
}

func (svc *AvatarService) allocFilepathForThumbnail(uid uint64, filename string) (string, error) {
	dir := fmt.Sprintf("%v/%v", svc.OutDir, uid)

	err := os.MkdirAll(dir, os.ModeDir)
	if err != nil {
		return "", err
	}
	return dir + "/" + filename, nil
}

func (svc *AvatarService) copyStringArray(arr []string) []string {
	dest := make([]string, len(arr))
	copy(dest, arr)
	return dest
}
