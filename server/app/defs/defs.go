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

// MS(memory storage, e.g. redis) keys
const (
	MSSIDToUser      = "auth-ss:%v"    // K: sid, V: session user json value
	MSUserIDToSID    = "auth-us:%v"    // K: user id, V: sid
	MSCaptcha        = "captcha:%v:%v" // K: cap:<user id>:<type> V: captcha value
	MSCaptchaTimeout = 3 * 60
)

// Top-level routes
const (
	RouteUser      = "user"
	RoutePost      = "p"
	RouteAuth      = "auth" // Used by both `/auth` and `/s/r/auth`.
	RouteTest      = "t"
	RouteDashboard = "m"
	RouteAPI       = "s"
)

const (
	CookieDefaultExpires = 1296000
	UserPostsLimit       = 10
)

const (
	EntityPost  = 1
	EntityCmt   = 2
	EntityReply = 3
)
