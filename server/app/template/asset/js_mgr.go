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
	Post      string
	Dashboard string
	Profile   string

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
		r.Main = js("coreEntryDev")
	} else {
		r.Main = js("coreEntry")
	}
	r.Post = js("postEntry")
	r.Dashboard = js("dashboardEntry")
	r.Profile = js("profile")
	return r
}
