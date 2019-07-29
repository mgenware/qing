package asset

func htmlScript(src string) string {
	return "<script src=\"" + src + "\"></script>"
}

func sysScript(src string) string {
	return "<script>System.import('" + src + "')</script>"
}

func js(name string) string {
	return sysScript("/static/d/js/" + name + ".js")
}

func libJS(name string) string {
	return htmlScript("/static/lib/" + name + ".js")
}

type JSManager struct {
	dev bool

	Loader    string
	Polyfills string
	Main      string
	Dashboard string

	LSCS string
	LSEN string
}

func NewJSManager(dev bool) *JSManager {
	r := &JSManager{dev: dev}
	r.LSCS = js("ls_cs")
	r.LSEN = js("ls_en")
	r.Loader = libJS("s3.1.6.min")
	r.Polyfills = libJS("webcomponents-bundle")
	if dev {
		r.Main = js("devCoreEntry")
	} else {
		r.Main = js("coreEntry")
	}
	r.Dashboard = js("mEntry")
	return r
}
