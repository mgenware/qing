package internals

type LocalizationConfig struct {
	Dir         string `json:"dir" validate:"required"`
	DefaultLang string `json:"defaultLang" validate:"required"`
}
