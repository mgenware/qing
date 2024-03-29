/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package localization

import (
	"context"
	"errors"
	"net/http"
	"path/filepath"

	"golang.org/x/text/language"

	"qing/a/appLog"
	"qing/a/appcm"
	"qing/a/cfgx"
	"qing/a/def"
	"qing/a/def/appDef"
	"qing/a/def/infraDef"
	"qing/lib/httplib"
)

type Manager struct {
	cc           *cfgx.CoreConfig
	fallbackDict *Dictionary
	fallbackLang string
	lsDict       map[string]*Dictionary
	langTags     []language.Tag

	// Could be nil if `appCfg.Langs` contain only one lang.
	langMatcher language.Matcher
}

// NewManagerFromConfig creates a Manager from a config.
func NewManagerFromConfig(cc *cfgx.CoreConfig) (*Manager, error) {
	confLangs := cc.Site.Langs
	if len(confLangs) == 0 {
		return nil, errors.New("unexpected empty `langs` field")
	}

	lsDict := make(map[string]*Dictionary)
	for _, langName := range confLangs {
		dictPath := filepath.Join(infraDef.LangsDir, langName+".json")
		appLog.Get().Info("app.ls.loading", "file", dictPath)
		d, err := ParseDictionary(dictPath)
		if err != nil {
			return nil, err
		}
		lsDict[langName] = d
	}

	fallbackLang := confLangs[0]
	fallbackDict := lsDict[fallbackLang]

	var matcher language.Matcher
	var tags []language.Tag
	if len(confLangs) > 0 {
		for _, langName := range confLangs {
			t := language.MustParse(langName)
			tags = append(tags, t)
		}
		matcher = language.NewMatcher(tags)
	}

	if fallbackDict == nil {
		return nil, errors.New("unexpected nil `fallbackDict`")
	}

	return &Manager{lsDict: lsDict, fallbackDict: fallbackDict, fallbackLang: fallbackLang, langMatcher: matcher, langTags: tags, cc: cc}, nil
}

// FallbackLanguage returns the default language of this manager.
func (mgr *Manager) FallbackLanguage() string {
	return mgr.fallbackLang
}

// LangTags returns language tags.
func (mgr *Manager) LangTags() []language.Tag {
	return mgr.langTags
}

// Dictionary returns the Dictionary associated with the specified language.
// If the given language is not found, it returns a fallback dictionary.
func (mgr *Manager) Dictionary(lang string) *Dictionary {
	dict := mgr.lsDict[lang]
	if dict == nil {
		return mgr.fallbackDict
	}
	return dict
}

func (mgr *Manager) getLanguageFromRequest(w http.ResponseWriter, r *http.Request) string {
	// Check if user has explicitly set a language.
	cookieLang, _ := httplib.ReadCookie(r, appDef.KeyLang)
	if cookieLang != "" {
		return cookieLang
	}

	// If none of the above values exist, use the language matcher.
	accept := r.Header.Get("Accept-Language")
	langTag, _ := language.MatchStrings(mgr.langMatcher, accept)
	return langTag.String()
}

// MatchLanguage returns the determined language based on various conditions.
func (mgr *Manager) MatchLanguage(w http.ResponseWriter, r *http.Request) string {
	lang := mgr.getLanguageFromRequest(w, r)

	// Check if lang really exists.
	if mgr.lsDict[lang] == nil {
		lang = mgr.fallbackLang
	}

	// Write resolved lang to cookies.
	mgr.writeLangCookie(w, lang, mgr.cc)
	return lang
}

// EnableContextLanguage defines a middleware to set the context language associated with the request.
func (mgr *Manager) EnableContextLanguageMW(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// Respect user's language preference.
		user := appcm.ContextUser(ctx)
		var lang string
		if user != nil && user.Lang != "" {
			lang = user.Lang
		} else {
			lang = mgr.MatchLanguage(w, r)
		}
		ctx = context.WithValue(ctx, def.LanguageContextKey, lang)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (mgr *Manager) writeLangCookie(w http.ResponseWriter, lang string, cc *cfgx.CoreConfig) {
	c := httplib.NewCookie(appDef.KeyLang, lang, cc)
	http.SetCookie(w, c)
}
