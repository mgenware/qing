package internals

type LocalizationConfig struct {
	Dir         string `json:"dir" validate:"required"`
	DefaultLang string `json:"default_lang" validate:"required"`
}
