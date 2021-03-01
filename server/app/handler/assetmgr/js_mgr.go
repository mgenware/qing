package assetmgr

import "qing/app/cfg/config"

func htmlScript(src string, module bool) string {
	s := "<script src=\"" + src + "\""
	if module {
		s += " type=\"module\""
	}
	s += "></script>"
	return s
}

func sysScript(src string) string {
	return "<script>System.import('" + src + "')</script>"
}

func libJS(name string) string {
	return htmlScript("/static/lib/"+name+".js", false)
}

// JSManager manages JS assets.
type JSManager struct {
	dev  bool
	conf *config.TurboWebConfig

	Loader        string
	Polyfills     string
	Main          string
	Post          string
	Discussion    string
	M             string
	MX            string
	Lang          string
	Profile       string
	Auth          string
	HomeStd       string
	HomeFrm       string
	Forum         string
	ForumSettings string
	DevPage       string
}

// NewJSManager creates a new NewJSManager.
func NewJSManager(dev bool) *JSManager {
	r := &JSManager{}
	r.dev = dev

	r.Loader = libJS("s6.3.2.min")
	r.Polyfills = libJS("webcomponents-bundle")
	if r.dev {
		r.Main = r.js("coreEntryDev")
	} else {
		r.Main = r.js("coreEntry")
	}
	r.Post = r.js("postEntry")
	r.M = r.js("mEntry")
	r.MX = r.js("mxEntry")
	r.Profile = r.js("profileEntry")
	r.Auth = r.js("authEntry")
	r.Discussion = r.js("discussionEntry")
	r.HomeStd = r.js("homeStdEntry")
	r.HomeFrm = r.js("homeFrmEntry")
	r.Forum = r.js("forumEntry")
	r.ForumSettings = r.js("forumSettingsEntry")
	r.DevPage = r.js("devPageEntry")
	r.Lang = r.js("langEntry")
	return r
}

func (jsm *JSManager) js(name string) string {
	return sysScript("/static/d/js/" + name + ".js")
}
