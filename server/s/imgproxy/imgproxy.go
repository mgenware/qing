package imgproxy

import (
	"fmt"
	"net/http"
	"net/url"
	"qing/a/coreConfig"
	"qing/lib/iolib"
	"strconv"
)

type ImgProxy struct {
	port int
	host string
}

var imgProxy *ImgProxy

func init() {
	cc := coreConfig.Get()
	imgProxy = &ImgProxy{}
	imgProxy.port = cc.Extern.ImageProxy.Port
	imgProxy.host = fmt.Sprintf("http://img_proxy:%v", imgProxy.port)
}

func (p *ImgProxy) getURL(api, file string, values *url.Values) string {
	values.Add("file", file)
	return p.host + "/" + api + "?" + values.Encode()
}

func (p *ImgProxy) execToFile(url, destFile string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("%v returns %v", url, resp.StatusCode)
	}
	return iolib.CopyReaderToFile(resp.Body, destFile)
}

func (p *ImgProxy) Crop(src, dest string, x, y, width, height int) error {
	values := url.Values{}
	values.Add("left", strconv.Itoa(x))
	values.Add("top", strconv.Itoa(y))
	values.Add("areawidth", strconv.Itoa(width))
	values.Add("areaheight", strconv.Itoa(height))
	return p.execToFile(p.getURL("extract", src, &values), dest)
}

func (p *ImgProxy) Resize(src, dest string, width, height int) error {
	values := url.Values{}
	values.Add("width", strconv.Itoa(width))
	values.Add("height", strconv.Itoa(height))
	return p.execToFile(p.getURL("resize", src, &values), dest)
}

func Get() *ImgProxy {
	return imgProxy
}
