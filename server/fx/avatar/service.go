package avatar

import (
	"fmt"
	"log"
	"os"
	"path"
	"qing/app/logx"
	"qing/lib/iolib"
	"qing/lib/mathlib"
	"strings"
)

const (
	AvatarSize50  = 50
	AvatarSize150 = 150
	AvatarSize250 = 250
)

var resizedSizes = []int{AvatarSize250, AvatarSize150, AvatarSize50}

type Service struct {
	SavePath string
	Logger   *logx.Logger

	// e.g. [magick, convert]
	convertCmds []string
}

func NewService(savePath string, convertCmd string, logger *logx.Logger) (*Service, error) {
	logger.Info("avatar-service.starting", "path", savePath)
	s := &Service{}
	s.SavePath = savePath
	s.Logger = logger
	s.convertCmds = strings.Split(convertCmd, " ")
	// Check is converter is installed
	_, err := s.run([]string{"-version"})
	if err != nil {
		return nil, err
	}
	return s, nil
}

func (svc *Service) GetAvatarFilePath(uid uint64, size int, avatarName string) string {
	return fmt.Sprintf("/%v/%v/%v_%v", svc.SavePath, uid, size, avatarName)
}

/*
   User avatars are stored in following ways
   - DIOM/avatar/<uid>/<size>_<randname>.<png/jpg>
*/

func (svc *Service) SaveAvatarFromFile(src string, uid uint64) (string, error) {
	ext := path.Ext(src)
	avatarName := mathlib.RandString(6) + ext
	for _, size := range resizedSizes {
		fileNameWithSize := fmt.Sprintf("%v_%v", size, avatarName)
		newfilepath, err := svc.allocFilepathForThumb(uid, fileNameWithSize)
		if err != nil {
			return "", err
		}
		err = svc.thumbnailImg(src, newfilepath, size, size)
		if err != nil {
			return "", err
		}
	}
	return avatarName, nil
}

func (svc *Service) RemoveAvatarFiles(uid uint64, avatarName string) {
	for _, size := range resizedSizes {
		file := fmt.Sprintf("%v/%v/%v_%v", svc.SavePath, uid, size, avatarName)
		err := os.Remove(file)
		if err != nil {
			log.Print("Error removing old avatar files: ", err.Error())
		}
	}
}

func (svc *Service) allocFilepathForThumb(uid uint64, filename string) (string, error) {
	dir := fmt.Sprintf("%v/%v", svc.SavePath, uid)

	err := os.MkdirAll(dir, 0755)
	if err != nil {
		return "", err
	}
	return dir + "/" + filename, nil
}

func (svc *Service) run(args []string) (string, error) {
	cmd := svc.convertCmds[0]
	strArray := svc.copyStringArray(svc.convertCmds[1:])
	strArray = append(strArray, args...)
	return iolib.Exec(cmd, strArray...)
}

func (svc *Service) copyStringArray(arr []string) []string {
	dest := make([]string, len(arr))
	copy(dest, arr)
	return dest
}

func (svc *Service) thumbnailImg(src, dest string, maxWidth, maxHeight int) error {
	_, err := iolib.Exec("convert", src, "-resize", fmt.Sprintf("%vx%v", maxWidth, maxHeight), dest)
	return err
}
