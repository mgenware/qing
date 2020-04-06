package handler

// ErrorPageData contains information about an error.
type ErrorPageData struct {
	LocalizedTemplateData
	Message string
}
