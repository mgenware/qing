package internals

// DebugConfig ...
type DebugConfig struct {
	ReloadViewsOnRefresh        bool `json:"reload_views_on_refresh"`
	PanicOnUnexpectedHTMLErrors bool `json:"panic_on_unexpected_html_errors"`
	PanicOnUnexpectedJSONErrors bool `json:"panic_on_unexpected_json_errors"`
	QuickLogin                  bool `json:"quick_login"`
}
