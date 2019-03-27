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

// UserTableSelectProfileResult ...
type UserTableSelectProfileResult struct {
	ID       uint64
	Name     string
	IconName string
	Location string
	Company  string
	Website  string
	Bio      *string
}

// SelectProfile ...
func (da *TableTypeUser) SelectProfile(queryable dbx.Queryable, id uint64) (*UserTableSelectProfileResult, error) {
	result := &UserTableSelectProfileResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.Bio)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UserTableSelectSessionDataResult ...
type UserTableSelectSessionDataResult struct {
	ID       uint64
	Name     string
	IconName string
}

// SelectSessionData ...
func (da *TableTypeUser) SelectSessionData(queryable dbx.Queryable, id uint64) (*UserTableSelectSessionDataResult, error) {
	result := &UserTableSelectSessionDataResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UserTableSelectEditingDataResult ...
type UserTableSelectEditingDataResult struct {
	ID       uint64
	Name     string
	IconName string
	Location string
	Company  string
	Website  string
	Bio      *string
	BioSrc   *string
}

// SelectEditingData ...
func (da *TableTypeUser) SelectEditingData(queryable dbx.Queryable, id uint64) (*UserTableSelectEditingDataResult, error) {
	result := &UserTableSelectEditingDataResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio`, `bio_src` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.Bio, &result.BioSrc)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateEditingData ...
func (da *TableTypeUser) UpdateEditingData(queryable dbx.Queryable, id uint64, name string, website string, company string, location string) error {
	result, err := queryable.Exec("UPDATE `user` SET `name` = ?, `website` = ?, `company` = ?, `location` = ? WHERE `id` = ?", name, website, company, location, id)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// UpdateBio ...
func (da *TableTypeUser) UpdateBio(queryable dbx.Queryable, id uint64, bio *string) error {
	result, err := queryable.Exec("UPDATE `user` SET `bio` = ? WHERE `id` = ?", bio, id)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// SelectIconName ...
func (da *TableTypeUser) SelectIconName(queryable dbx.Queryable, id uint64) (string, error) {
	var result string
	err := queryable.QueryRow("SELECT `icon_name` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UpdateIconName ...
func (da *TableTypeUser) UpdateIconName(queryable dbx.Queryable, id uint64, iconName string) error {
	result, err := queryable.Exec("UPDATE `user` SET `icon_name` = ? WHERE `id` = ?", iconName, id)
	return dbx.CheckOneRowAffectedWithError(result, err)
}
