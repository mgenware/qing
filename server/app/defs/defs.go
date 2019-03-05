package defs

type ContextKey string

const (
	LanguageContextKey ContextKey = "lang"
	LanguageCookieKey             = "lang"
	LanguageQueryKey              = "lang"
	LanguageCSString              = "cs"
	LanguageENString              = "en"
)

const (
	APIGenericError      uint = 1000
	APINeedAuthError     uint = 1001
	CookieDefaultExpires      = 1296000
)

const (
	AvatarDirName = "user_avatar"
)

// Cookie keys
const (
	SessionCookieKey = "_ut"
)

// Context keys
const (
	SIDContextKey  ContextKey = "sid"
	UserContextKey ContextKey = "user"
)

// Redis keys
const (
	SIDToUserRedisKey   = "ss" // k: sid, v: session user json value
	UserIDToSIDRedisKey = "us" // k: user id, v: sid
)
