package langp

// LangInfo contains information about a language.
type LangInfo struct {
	ID            string
	Name          string
	LocalizedName string
}

// LangWindData passes page data to language settings page.
type LangWindData struct {
	Langs []LangInfo
}
