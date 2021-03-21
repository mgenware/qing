/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package rcom

// PageURLFormatter is used when PageData need to get a URL with a page number.
type PageURLFormatter interface {
	GetURL(page int) string
}

// PageData contains information about pagination.
type PageData struct {
	urlFormatter PageURLFormatter

	HasPrevPage bool
	HasNextPage bool
	Page        int
	PrevPageURL string
	NextPageURL string

	// Properties only available when `TotalPage` is not 0.
	TotalPage    int
	FirstPageURL string
	LastPageURL  string
}

// NewPageData creates a PageData.
func NewPageData(page int, hasNextPage bool, formatter PageURLFormatter, totalPage int) *PageData {
	d := &PageData{urlFormatter: formatter, Page: page}
	hasTotalPage := totalPage > 0
	d.TotalPage = totalPage
	if page > 1 {
		d.HasPrevPage = true
		d.PrevPageURL = formatter.GetURL(page - 1)
		if hasTotalPage {
			d.FirstPageURL = formatter.GetURL(1)
		}
	}
	if hasNextPage {
		d.HasNextPage = true
		d.NextPageURL = formatter.GetURL(page + 1)
		if hasTotalPage {
			d.LastPageURL = formatter.GetURL(totalPage)
		}
	}
	return d
}
