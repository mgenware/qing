package asset

type JSManager struct {
	dev     bool
	BaseDir string

	// files included by master page
	Vendor string
	Main   string

	LSCS string
	LSEN string
}

func htmlScript(src string) string {
	return "<script src=\"" + src + "\"></script>"
}

func (jsm *JSManager) NamedJSFromRoot(name string) string {
	return htmlScript("/static/" + name + ".js")
}

func (jsm *JSManager) HashedJS(name string) string {
	return jsm.HashedJSFromRoot("/js/" + name)
}

func (jsm *JSManager) HashedJSFromRoot(path string) string {
	glob := path + ".*js"
	return jsm.HashedJSWithGlob(glob)
}

func (jsm *JSManager) HashedJSWithGlob(glob string) string {
	res := ""
	var err error
	res, err = match(jsm.BaseDir, glob)
	if err != nil {
		panic(err)
	}
	return htmlScript(res)
}
