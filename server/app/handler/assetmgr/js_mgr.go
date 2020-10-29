package assetmgr

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

// JSManager manages JS assets.
type JSManager struct {
	dev bool

	Loader    string
	Polyfills string
	Main      string
	Post      string
	Thread    string
	Dashboard string
	Profile   string
	Auth      string

	LSCS string
	LSEN string
}

func NewJSManager(dev bool) *JSManager {
	r := &JSManager{dev: dev}
	r.LSCS = js("ls_cs")
	r.LSEN = js("ls_en")
	r.Loader = libJS("s6.3.2.min")
	r.Polyfills = libJS("webcomponents-bundle")
	if dev {
		r.Main = js("coreEntryDev")
	} else {
		r.Main = js("coreEntry")
	}
	r.Post = js("postEntry")
	r.Dashboard = js("dashboardEntry")
	r.Profile = js("profileEntry")
	r.Auth = js("authEntry")
	r.Thread = js("theadEntry")
	return r
}
