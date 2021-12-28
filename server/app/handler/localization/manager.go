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

	"qing/app/appCookies"
	"qing/app/appLog"
	"qing/app/config/configs"
	"qing/app/defs"
)

type Manager struct {
	conf         *configs.LocalizationConfig
	fallbackDict *Dictionary
	fallbackLang string
	dicts        map[string]*Dictionary
	langTags     []language.Tag

	// Could be nil if `conf.Langs` contain only one lang.
	langMatcher language.Matcher
}

// NewManagerFromConfig creates a Manager from a config.
func NewManagerFromConfig(conf *configs.LocalizationConfig) (*Manager, error) {
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
		appLog.Get().Info("Loaded localization file", langName)
	}

	fallbackLang := conf.Langs[0]
	fallbackDict := dicts[fallbackLang]

	var matcher language.Matcher
	var tags []language.Tag
	if len(conf.Langs) > 0 {
		for _, langName := range conf.Langs {
			t := language.MustParse(langName)
			tags = append(tags, t)
		}
		matcher = language.NewMatcher(tags)
	}

	return &Manager{dicts: dicts, fallbackDict: fallbackDict, fallbackLang: fallbackLang, langMatcher: matcher, langTags: tags}, nil
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
func (mgr *Manager) Dictionary(lang string) *Dictionary {
	dict := mgr.dicts[lang]
	if dict == nil {
		return mgr.fallbackDict
	}
	return dict
}

func (mgr *Manager) getLanguageFromRequest(w http.ResponseWriter, r *http.Request) string {
	// Check if user has explicitly set a language.
	cookieLang, _ := r.Cookie(defs.Shared.KeyLang)
	if cookieLang != nil {
		return cookieLang.Value
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
	if mgr.dicts[lang] == nil {
		lang = mgr.fallbackLang
	}

	// Write resolved lang to cookies.
	mgr.writeLangCookie(w, lang)
	return lang
}

// EnableContextLanguage defines a middleware to set the context language associated with the request.
func (mgr *Manager) EnableContextLanguageMW(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		lang := mgr.MatchLanguage(w, r)
		ctx = context.WithValue(ctx, defs.LanguageContextKey, lang)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (mgr *Manager) writeLangCookie(w http.ResponseWriter, lang string) {
	c := appCookies.NewCookie(defs.Shared.KeyLang, lang)
	http.SetCookie(w, c)
}
