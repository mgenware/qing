package apidata

// PaginatedList contains information that is paginated.
type PaginatedList struct {
	Items      interface{} `json:"items"`
	HasNext    bool        `json:"hasNext"`
	TotalCount uint        `json:"totalCount"`
}

// NewPaginatedList creates a new PaginatedList.
func NewPaginatedList(items interface{}, hasNext bool, totalCount uint) *PaginatedList {
	return &PaginatedList{
		Items: items, HasNext: hasNext, TotalCount: totalCount,
	}
}
