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
	// K: sid, V: session user json value
	MSSIDToUser = "auth-ss:%v"
	// K: user id, V: sid
	MSUserIDToSID = "auth-us:%v"
	// K: cap:<user id>:<type> V: captcha value
	MSCaptcha        = "captcha:%v:%v"
	MSCaptchaTimeout = 3 * 60

	MSRegEmailTimeout = 60 * 60
	// K: Secret ID sent to user email, V: user pwd
	MSRegEmailPrefix = "reg-email"
)

// Top-level routes
const (
	RouteUser      = "user"
	RoutePost      = "p"
	RouteAuth      = "auth" // Used by both `/auth` and `/s/r/auth`.
	RouteTest      = "test"
	RouteDashboard = "home"
	RouteAPI       = "s"
	RouteForum     = "f"
	RouteThread    = "t"
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
