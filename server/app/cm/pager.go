package cm

import (
	"fmt"
)

// Pager contains information about paging.
type Pager struct {
	HasPrevPage  bool
	HasNextPage  bool
	URLFormatter string
	Page         int
	PrevPageURL  string
	NextPageURL  string
}

// NewPager creates a Pager.
func NewPager(page int, hasNextPage bool, formatter string) *Pager {
	d := &Pager{URLFormatter: formatter, Page: page}
	if page > 1 {
		d.HasPrevPage = true
		d.PrevPageURL = fmt.Sprintf(formatter, page-1)
	}
	if hasNextPage {
		d.HasNextPage = true
		d.NextPageURL = fmt.Sprintf(formatter, page+1)
	}
	return d
}
