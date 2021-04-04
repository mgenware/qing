/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package imgx

import (
	"fmt"
	"qing/app"
	"qing/lib/iolib"
)

// Imgx is the service type for imaging operations in this app.
type Imgx struct {
	logger app.CoreLog
	cmd    string
}

// NewImgx creates a new Imgx.
func NewImgx(cmd string, logger app.CoreLog) (*Imgx, error) {
	// Check if `magick` command is available.
	_, err := iolib.Exec(cmd, "-version")
	if err != nil {
		return nil, err
	}
	return &Imgx{logger: logger, cmd: cmd}, nil
}

// ResizeFile resizes the given source file into the specified
// size, and writes result to the given destination.
func (svr *Imgx) ResizeFile(src, dest string, width, height int) error {
	return svr.run("convert", src, "-resize", fmt.Sprintf("%vx%v!", width, height), dest)
}

// CropFile crops the given source file into the specified
// params, and writes result to the given destination.
func (svr *Imgx) CropFile(src, dest string, x, y, width, height int) error {
	return svr.run("convert", src, "-crop", fmt.Sprintf("%vx%v+%v+%v", width, height, x, y), dest)
}

func (svr *Imgx) run(args ...string) error {
	_, err := iolib.Exec(svr.cmd, args...)
	if err != err {
		return err
	}
	return nil
}
