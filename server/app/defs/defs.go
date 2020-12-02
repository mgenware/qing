package defs

type ContextKey string

const (
	LanguageCookieKey = "lang"
	LanguageQueryKey  = "lang"
	LanguageCSString  = "cs"
	LanguageENString  = "en"
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
	LanguageContextKey ContextKey = "lang"
	DictContextKey     ContextKey = "dict"
	SIDContextKey      ContextKey = "sid"
	UserContextKey     ContextKey = "user"
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

const (
	CookieDefaultExpires = 1296000
	UserPostsLimit       = 10
)
