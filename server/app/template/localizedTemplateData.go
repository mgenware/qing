package template

// ILocalizedTemplateData is the base type for localized models when applied to template.
type ILocalizedTemplateData interface {
	SetLS(value map[string]string)
}

// LocalizedTemplateData implements ILocalizedTemplateData.
type LocalizedTemplateData struct {
	LS map[string]string
}

func (td *LocalizedTemplateData) SetLS(value map[string]string) {
	td.LS = value
}
