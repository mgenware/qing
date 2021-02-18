package config

type TurboWebConfig struct {
	Dir string `json:"dir"`
	URL string `json:"url"`
}

// DebugConfig ...
type DebugConfig struct {
	ReloadViewsOnRefresh        bool            `json:"reload_views_on_refresh"`
	PanicOnUnexpectedHTMLErrors bool            `json:"panic_on_unexpected_html_errors"`
	PanicOnUnexpectedJSONErrors bool            `json:"panic_on_unexpected_json_errors"`
	QuickLogin                  bool            `json:"quick_login"`
	TurboWeb                    *TurboWebConfig `json:"turbo_web"`
}
