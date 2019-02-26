package avatar

import (
	"fmt"
	"log"
	"os"
	"path"
	"qing/app/logx"
	"qing/lib/io2"
	"qing/lib/math2"
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
}

func NewService(savePath string, logger *logx.Logger) (*Service, error) {
	logger.LogInfo("avatar-service.starting", logx.D{"path": savePath})
	s := &Service{}
	s.SavePath = savePath
	s.Logger = logger

	_, err := io2.Exec("convert", "-version")
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
	avatarName := math2.RandString(6) + ext
	for _, size := range resizedSizes {
		fileNameWithSize := fmt.Sprintf("%v_%v", size, avatarName)
		newfilepath, err := svc.allocFilepathForThumb(uid, fileNameWithSize)
		if err != nil {
			return "", err
		}
		err = thumbnailImg(src, newfilepath, size, size)
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
