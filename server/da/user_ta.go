/******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import "github.com/mgenware/mingru-go-lib"

// TableTypeUser ...
type TableTypeUser struct {
}

// User ...
var User = &TableTypeUser{}

// ------------ Actions ------------

// AddUserEntryInternal ...
func (da *TableTypeUser) AddUserEntryInternal(queryable mingru.Queryable, email string, name string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `user` (`email`, `name`, `icon_name`, `created_time`, `company`, `website`, `location`, `bio`) VALUES (?, ?, '', UTC_TIMESTAMP(), '', '', '', NULL)", email, name)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

// AddUserStatsEntryInternal ...
func (da *TableTypeUser) AddUserStatsEntryInternal(queryable mingru.Queryable, id uint64) error {
	_, err := queryable.Exec("INSERT INTO `user_stats` (`id`, `post_count`, `discussion_count`) VALUES (?, 0, 0)", id)
	return err
}

// UserTableSelectEditingDataResult ...
type UserTableSelectEditingDataResult struct {
	ID       uint64  `json:"-"`
	Name     string  `json:"name,omitempty"`
	IconName string  `json:"-"`
	Location string  `json:"location,omitempty"`
	Company  string  `json:"company,omitempty"`
	Website  string  `json:"website,omitempty"`
	Bio      *string `json:"bio,omitempty"`
}

// SelectEditingData ...
func (da *TableTypeUser) SelectEditingData(queryable mingru.Queryable, id uint64) (*UserTableSelectEditingDataResult, error) {
	result := &UserTableSelectEditingDataResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.Bio)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// SelectIconName ...
func (da *TableTypeUser) SelectIconName(queryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := queryable.QueryRow("SELECT `icon_name` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// SelectIDFromEmail ...
func (da *TableTypeUser) SelectIDFromEmail(queryable mingru.Queryable, email string) (uint64, error) {
	var result uint64
	err := queryable.QueryRow("SELECT `id` FROM `user` WHERE `email` = ?", email).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UserTableSelectProfileResult ...
type UserTableSelectProfileResult struct {
	ID       uint64  `json:"-"`
	Name     string  `json:"name,omitempty"`
	IconName string  `json:"iconName,omitempty"`
	Location string  `json:"location,omitempty"`
	Company  string  `json:"company,omitempty"`
	Website  string  `json:"website,omitempty"`
	Bio      *string `json:"bio,omitempty"`
}

// SelectProfile ...
func (da *TableTypeUser) SelectProfile(queryable mingru.Queryable, id uint64) (*UserTableSelectProfileResult, error) {
	result := &UserTableSelectProfileResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.Bio)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UserTableSelectSessionDataResult ...
type UserTableSelectSessionDataResult struct {
	ID       uint64 `json:"ID,omitempty"`
	Name     string `json:"name,omitempty"`
	IconName string `json:"iconName,omitempty"`
}

// SelectSessionData ...
func (da *TableTypeUser) SelectSessionData(queryable mingru.Queryable, id uint64) (*UserTableSelectSessionDataResult, error) {
	result := &UserTableSelectSessionDataResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateBio ...
func (da *TableTypeUser) UpdateBio(queryable mingru.Queryable, id uint64, bio *string) error {
	result, err := queryable.Exec("UPDATE `user` SET `bio` = ? WHERE `id` = ?", bio, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateIconName ...
func (da *TableTypeUser) UpdateIconName(queryable mingru.Queryable, id uint64, iconName string) error {
	result, err := queryable.Exec("UPDATE `user` SET `icon_name` = ? WHERE `id` = ?", iconName, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateProfile ...
func (da *TableTypeUser) UpdateProfile(queryable mingru.Queryable, id uint64, name string, website string, company string, location string) error {
	result, err := queryable.Exec("UPDATE `user` SET `name` = ?, `website` = ?, `company` = ?, `location` = ? WHERE `id` = ?", name, website, company, location, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
