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
	Profile       string
	Auth          string
	HomeStd       string
	HomeFrm       string
	Forum         string
	ForumSettings string
	DevPage       string
}

// NewJSManager creates a new NewJSManager.
func NewJSManager(conf *config.TurboWebConfig) *JSManager {
	r := &JSManager{}
	r.conf = conf
	r.dev = conf != nil

	r.Loader = libJS("s6.3.2.min")
	r.Polyfills = libJS("webcomponents-bundle")
	if r.dev {
		r.Main = r.js("coreEntryDev")
	} else {
		r.Main = r.js("coreEntry")
	}
	r.Post = r.js("post/postEntry")
	r.M = r.js("mm/Entry")
	r.MX = r.js("mx/mxEntry")
	r.Profile = r.js("profile/profileEntry")
	r.Auth = r.js("auth/authEntry")
	r.Discussion = r.js("discussion/discussionEntry")
	r.HomeStd = r.js("home/homeStdEntry")
	r.HomeFrm = r.js("home/homeFrmEntry")
	r.Forum = r.js("forum/forumEntry")
	r.ForumSettings = r.js("forumSettings/forumSettingsEntry")
	r.DevPage = r.js("devPage/devPageEntry")
	return r
}

func (jsm *JSManager) js(name string) string {
	return htmlScript(jsm.conf.URL+"/dist/"+name+".js", true)
}
