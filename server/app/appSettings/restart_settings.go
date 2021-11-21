package appSettings

// Keeps track of a list of settings that need a server restart to take effect.
var restartSettings map[int]bool

const (
	ForumsRestartSettings = iota
)

func init() {
	restartSettings = make(map[int]bool)
}

func GetRestartSettings() map[int]bool {
	return restartSettings
}

func AddRestartSettings(name int) {
	restartSettings[name] = true
}
