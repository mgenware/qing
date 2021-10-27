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
	relPath      string
	physicalPath string
	volumePath   string
}

const volumeTmpDir = "/app_tmp"

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
	if err != nil {
		return res, err
	}
	err = os.MkdirAll(dir, os.ModeDir)
	if err != nil {
		return res, err
	}

	file := filepath.Join(dir, fileName)
	res.physicalPath = file
	res.relPath = filepath.Join(dirName, fileName)
	res.volumePath = volumeTmpDir + "/" + res.relPath
	return res, nil
}

func (t *TmpFile) Delete() error {
	return os.Remove(t.physicalPath)
}

func (t *TmpFile) RelPath() string {
	return t.relPath
}

func (t *TmpFile) PhysicalPath() string {
	return t.physicalPath
}

func (t *TmpFile) VolumePath() string {
	return t.volumePath
}
