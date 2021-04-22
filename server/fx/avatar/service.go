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
	"qing/fx/imgx"
	"qing/lib/randlib"
)

const (
	AvatarSize50  = 50
	AvatarSize150 = 150
	AvatarSize250 = 250
)

var resizedSizes = []int{AvatarSize250, AvatarSize150, AvatarSize50}

// Service is the avatar service type.
type Service struct {
	imaging *imgx.Imgx
	OutDir  string
	Logger  app.CoreLog
}

// NewService creates a new avatar service object.
func NewService(outDir string, imaging *imgx.Imgx, logger app.CoreLog) (*Service, error) {
	s := &Service{}
	if !filepath.IsAbs(outDir) {
		panic(fmt.Sprintf("avatar service outDir must be an absolute path, got \"%v\"", outDir))
	}
	logger.Info("avatar-service.starting", "path", outDir)
	s.OutDir = outDir
	s.Logger = logger
	s.imaging = imaging
	return s, nil
}

// GetAvatarFilePath returns the physical avatar file path.
func (svc *Service) GetAvatarFilePath(uid uint64, size int, avatarName string) string {
	return fmt.Sprintf("/%v/%v/%v_%v", svc.OutDir, uid, size, avatarName)
}

// SetAvatarFromFile updates the given user's avatar with the specified file path.
func (svc *Service) SetAvatarFromFile(src string, uid uint64) (string, error) {
	ext := path.Ext(src)
	avatarName := randlib.RandString(6) + ext
	for _, size := range resizedSizes {
		fileNameWithSize := fmt.Sprintf("%v_%v", size, avatarName)
		newfilepath, err := svc.allocFilepathForThumb(uid, fileNameWithSize)
		if err != nil {
			return "", err
		}
		err = svc.imaging.ResizeFile(src, newfilepath, size, size)
		if err != nil {
			return "", err
		}
	}
	return avatarName, nil
}

// RemoveAvatarFiles deletes old avatar files of a specified user.
func (svc *Service) RemoveAvatarFiles(uid uint64, avatarName string) {
	for _, size := range resizedSizes {
		file := fmt.Sprintf("%v/%v/%v_%v", svc.OutDir, uid, size, avatarName)
		err := os.Remove(file)
		if err != nil {
			log.Print("Error removing old avatar files: ", err.Error())
		}
	}
}

func (svc *Service) allocFilepathForThumb(uid uint64, filename string) (string, error) {
	dir := fmt.Sprintf("%v/%v", svc.OutDir, uid)

	err := os.MkdirAll(dir, 0755)
	if err != nil {
		return "", err
	}
	return dir + "/" + filename, nil
}

func (svc *Service) copyStringArray(arr []string) []string {
	dest := make([]string, len(arr))
	copy(dest, arr)
	return dest
}
