package handler

import "qing/app/handler/localization"

// ILocalizedTemplateData is the base type for localized models when applied to template.
type ILocalizedTemplateData interface {
	SetLS(value *localization.Dictionary)
}

// LocalizedTemplateData implements ILocalizedTemplateData.
type LocalizedTemplateData struct {
	LS *localization.Dictionary `json:"-"`
}

func (td *LocalizedTemplateData) SetLS(value *localization.Dictionary) {
	td.LS = value
}
