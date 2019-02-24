package homePage

import "qing/app/template"

// HomePageData contains the information needed for generating the home page.
type HomePageData struct {
	template.LocalizedTemplateData

	Time string
}
