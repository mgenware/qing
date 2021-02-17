package localization

import (
	"context"
	"errors"
	"log"
	"net/http"
	"path/filepath"
	"time"

	"golang.org/x/text/language"

	"qing/app/cfg/config"
	"qing/app/defs"
)

type Manager struct {
	conf         *config.LocalizationConfig
	fallbackDict *Dictionary
	fallbackLang string
	dicts        map[string]*Dictionary
	// Could be nil if `conf.Langs` contain only one lang.
	langMatcher language.Matcher
}

// NewManagerFromConfig creates a Manager from a config.
func NewManagerFromConfig(conf *config.LocalizationConfig) (*Manager, error) {
	if len(conf.Langs) == 0 {
		return nil, errors.New("Unexpected empty `langs` config")
	}

	dicts := make(map[string]*Dictionary)
	for _, langName := range conf.Langs {
		dictPath := filepath.Join(conf.Dir, langName+".json")
		d, err := ParseDictionary(dictPath)
		if err != nil {
			return nil, err
		}
		dicts[langName] = d
		log.Printf("✅ Loaded localization file \"%v\"", langName)
	}

	fallbackLang := conf.Langs[0]
	fallbackDict := dicts[fallbackLang]

	var matcher language.Matcher
	if len(conf.Langs) > 0 {
		var tags []language.Tag
		for _, langName := range conf.Langs {
			t := language.MustParse(langName)
			tags = append(tags, t)
		}
	}

	return &Manager{dicts: dicts, fallbackDict: fallbackDict, fallbackLang: fallbackLang}, nil
}

// FallbackLanguage returns the default language of this manager.
func (mgr *Manager) FallbackLanguage() string {
	return mgr.fallbackLang
}

// Dictionary returns the Dictionary associated with the specified language.
func (mgr *Manager) Dictionary(lang string) *Dictionary {
	dict := mgr.dicts[lang]
	if dict == nil {
		return mgr.fallbackDict
	}
	return dict
}

// MatchLanguage returns the determined language based on various conditions.
func (mgr *Manager) MatchLanguage(w http.ResponseWriter, r *http.Request) string {
	// Check if user has explicitly set a language.
	queryLang := r.FormValue(defs.LanguageQueryKey)
	if queryLang != "" {
		mgr.writeLangCookie(w, queryLang)
		return queryLang
	}

	// If no user-specified language exists, try to use the cookie value.
	cookieLang, _ := r.Cookie(defs.LanguageCookieKey)
	if cookieLang != nil {
		return cookieLang.Value
	}

	// If none of the above values exist, use the language matcher.
	accept := r.Header.Get("Accept-Language")
	_, index := language.MatchStrings(matcher, accept)

	var resolved string
	if index == 1 {
		resolved = defs.LanguageCSString
	}

	// Fallback to default lang
	resolved = mgr.defaultLang

	// Write resolved lang to cookies
	mgr.writeLangCookie(w, resolved)
	return resolved
}

// EnableContextLanguage defines a middleware to set the context language associated with the request.
func (mgr *Manager) EnableContextLanguage(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		lang := mgr.MatchLanguage(w, r)
		ctx = context.WithValue(ctx, defs.LanguageContextKey, lang)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (mgr *Manager) writeLangCookie(w http.ResponseWriter, lang string) {
	// Write the user specified language to cookies
	expires := time.Now().Add(30 * 24 * time.Hour)
	c := &http.Cookie{Name: defs.LanguageCookieKey, Value: lang, Expires: expires}
	http.SetCookie(w, c)
}
