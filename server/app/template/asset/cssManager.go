package asset

type CSSManager struct {
	dev     bool
	BaseDir string

	Vendor string
	Main   string
}

func htmlCSS(src string) string {
	return "<link href=\"" + src + "\" rel=\"stylesheet\"/>"
}

func (cssm *CSSManager) NamedJSFromRoot(name string) string {
	return htmlCSS("/static/" + name + ".css")
}

func (cssm *CSSManager) HashedCSS(name string) string {
	return cssm.HashedCSSFromRoot("/css/" + name)
}

func (cssm *CSSManager) HashedCSSFromRoot(path string) string {
	glob := path + ".*css"
	return cssm.HashedCSSWithGlob(glob)
}

func (cssm *CSSManager) HashedCSSWithGlob(glob string) string {
	res := ""
	var err error
	res, err = match(cssm.BaseDir, glob)
	if err != nil {
		panic(err)
	}
	return htmlCSS(res)
}
