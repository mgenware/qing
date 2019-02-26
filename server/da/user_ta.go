 /******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"github.com/mgenware/go-packagex/dbx"
)

// TableTypeUser ...
type TableTypeUser struct {
}

// User ...
var User = &TableTypeUser{}

// ------------ Actions ------------

// UserTableSelectUserProfileResult ...
type UserTableSelectUserProfileResult struct {
	ID       uint64
	Name     string
	IconName string
	Location string
	Company  string
	Website  string
	Bio      *string
}

// SelectUserProfile ...
func (da *TableTypeUser) SelectUserProfile(queryable dbx.Queryable, id uint64) (*UserTableSelectUserProfileResult, error) {
	result := &UserTableSelectUserProfileResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.Bio)
	if err != nil {
		return nil, err
	}
	return result, nil
}
