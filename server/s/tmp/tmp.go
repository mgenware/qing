package tmp

import (
	"os"
	"path/filepath"
	"qing/app/appConfig"

	"github.com/google/uuid"
)

type TmpService struct {
	tmpDir string
}

type TmpFile struct {
	path string
}

var tmpService *TmpService

func init() {
	conf := appConfig.Get()
	tmpService = &TmpService{tmpDir: conf.TmpDir}
}

func (t *TmpService) TmpDir() string {
	return t.tmpDir
}

func NewFile(dirName, ext string) (TmpFile, error) {
	res := TmpFile{}
	id, err := uuid.NewRandom()
	if err != nil {
		return res, err
	}
	fileName := id.String() + ext

	dir := filepath.Join(tmpService.TmpDir(), dirName)
	err = os.MkdirAll(dir, os.ModeDir)
	if err != nil {
		return res, err
	}

	file := filepath.Join(dir, fileName)
	res.path = file
	return res, nil
}

func (t *TmpFile) Delete() error {
	return os.Remove(t.path)
}

func (t *TmpFile) Path() string {
	return t.path
}
