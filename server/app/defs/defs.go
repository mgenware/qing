package defs

type ContextKey string

const (
	LanguageContextKey ContextKey = "lang"
	LanguageCookieKey             = "lang"
	LanguageQueryKey              = "lang"
	LanguageCSString              = "cs"
	LanguageENString              = "en"
	BodyContextKey     ContextKey = "body"
)

const (
	APIGenericError      uint = 1000
	APINeedAuthError     uint = 1001
	CookieDefaultExpires      = 1296000
)

const (
	AvatarResKey = "user_icon"
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

// Top-level routes
const (
	RouteUser              = "user"
	RoutePost              = "p"
	RouteAuth              = "auth"
	RouteTest              = "t"
	RouteDashboard         = "m"
	RouteRestrictedService = "sr"
)

const (
	UserPostsLimit = 20
)
