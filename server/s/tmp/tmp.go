package tmp

import (
	"os"
	"path/filepath"
	"qing/app"

	"github.com/google/uuid"
	"github.com/mgenware/goutil/iox"
)

type TmpService struct {
	tmpDir string
}

type TmpFile struct {
	path string
}

var tmpService *TmpService

func init() {
	conf := app.CoreConfig()
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
	err = iox.Mkdirp(dir)
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
