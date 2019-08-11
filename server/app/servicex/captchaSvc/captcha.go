package captchaSvc

import (
	"io"

	"github.com/mgenware/go-captcha"
)

type CaptchaService struct {
}

const (
	TypeNewPost = 1
)

func NewCaptchaService() *CaptchaService {
	return &CaptchaService{}
}

func (c *CaptchaService) WriteCaptcha(length int, w io.Writer) error {
}

func (c *CaptchaService) writeCaptchaCore(length int, w io.Writer) error {
	code := captcha.RandomDigits(length)
	img := captcha.NewImage("", code, 150, 45)
	_, err := img.WriteTo(w)
	return err
}
