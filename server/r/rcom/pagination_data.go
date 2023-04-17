/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package rcom

import "qing/a/handler"

// PageURLFormatter is used when PageData need to get a URL with a page number.
type PageURLFormatter interface {
	GetURL(page int) string
}

// PaginationData contains information about pagination.
type PaginationData struct {
	handler.LocalizedTemplateData

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

func NewPaginationData(page int, hasNextPage bool, formatter PageURLFormatter, totalPage int) *PaginationData {
	d := &PaginationData{urlFormatter: formatter, Page: page}
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
