package avatar

import (
	"fmt"
	"qing/lib/io2"
)

func thumbnailImg(src, dest string, maxWidth, maxHeight int) error {
	_, err := io2.Exec("convert", src, "-resize", fmt.Sprintf("%vx%v", maxWidth, maxHeight), dest)
	return err
}
