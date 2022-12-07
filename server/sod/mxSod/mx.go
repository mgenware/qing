/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * Do not edit this file manually.
 * Automatically generated via `qing sod mx`.
 * See `lib/dev/sod/objects/mx.yaml` for details.
 ******************************************************************************************/

package mxSod

type SiteSTBase struct {
	NeedRestart bool `json:"needRestart,omitempty"`
}

func NewSiteSTBase(needRestart bool) SiteSTBase {
	return SiteSTBase{
		NeedRestart: needRestart,
	}
}

type GetSiteGeneralST struct {
	SiteSTBase

	SiteURL  string   `json:"siteURL,omitempty"`
	SiteType int      `json:"siteType,omitempty"`
	SiteName string   `json:"siteName,omitempty"`
	Langs    []string `json:"langs,omitempty"`
}

func NewGetSiteGeneralST(siteSTBase *SiteSTBase, siteURL string, siteType int, siteName string, langs []string) GetSiteGeneralST {
	return GetSiteGeneralST{
		SiteSTBase: *siteSTBase,
		SiteURL: siteURL,
		SiteType: siteType,
		SiteName: siteName,
		Langs: langs,
	}
}

type SetSiteInfoSTData struct {
	SiteURL  string `json:"siteURL,omitempty"`
	SiteName string `json:"siteName,omitempty"`
}

func NewSetSiteInfoSTData(siteURL string, siteName string) SetSiteInfoSTData {
	return SetSiteInfoSTData{
		SiteURL: siteURL,
		SiteName: siteName,
	}
}
