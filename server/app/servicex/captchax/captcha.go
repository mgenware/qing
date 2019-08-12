package captchax

import (
	"bytes"
	"fmt"
	"io"
	"qing/app/defs"
	"qing/app/extern/redisx"
	"strconv"

	"github.com/mgenware/go-captcha"
)

type CaptchaService struct {
	redisConn *redisx.Conn
}

const (
	TypeNewPost = 1
)

var allowedTypes map[int]bool

func init() {
	allowedTypes = make(map[int]bool)
	allowedTypes[TypeNewPost] = true
}

func NewCaptchaService(redisConn *redisx.Conn) *CaptchaService {
	return &CaptchaService{redisConn: redisConn}
}

func (c *CaptchaService) IsTypeAllowed(tp int) bool {
	return allowedTypes[tp]
}

func (c *CaptchaService) WriteCaptcha(uid uint64, category int, length int, w io.Writer) error {
	code := captcha.RandomDigits(length)
	codeStr := c.bytesToString(code)
	err := c.registerCaptcha(uid, category, codeStr)
	if err != nil {
		return err
	}
	img := captcha.NewImage("", code, 150, 45)
	_, err = img.WriteTo(w)
	if err != nil {
		return err
	}
	return nil
}

func (c *CaptchaService) getMSKey(uid uint64, category int) string {
	return fmt.Sprintf(defs.MSCaptcha, uid, category)
}

func (c *CaptchaService) registerCaptcha(uid uint64, category int, value string) error {
	key := c.getMSKey(uid, category)
	return c.redisConn.SetStringValue(key, value, defs.MSCaptchaTimeout)
}

// Converts bytes from `captcha.RandomDigits` to a string.
func (c *CaptchaService) bytesToString(digits []byte) string {
	var buffer bytes.Buffer
	for _, d := range digits {
		buffer.WriteString(strconv.Itoa(int(d)))
	}
	return buffer.String()
}
