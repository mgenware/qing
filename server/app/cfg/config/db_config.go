package config

// DBConfig ...
type DBConfig struct {
	ConnString string `json:"conn_string" validate:"required"`
}
