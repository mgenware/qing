/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

 /******************************************************************************************
  * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/

package da

import (
	"database/sql"

	"github.com/mgenware/mingru-go-lib"
)

// TableTypeUser ...
type TableTypeUser struct {
}

// User ...
var User = &TableTypeUser{}

// ------------ Actions ------------

// AddUserEntryInternal ...
func (da *TableTypeUser) AddUserEntryInternal(queryable mingru.Queryable, email string, name string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `user` (`email`, `name`, `icon_name`, `created_at`, `company`, `website`, `location`, `bio`, `admin`) VALUES (?, ?, '', UTC_TIMESTAMP(), '', '', '', NULL, 0)", email, name)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

// AddUserStatsEntryInternal ...
func (da *TableTypeUser) AddUserStatsEntryInternal(queryable mingru.Queryable, id uint64) error {
	_, err := queryable.Exec("INSERT INTO `user_stats` (`id`, `post_count`, `discussion_count`, `question_count`, `answer_count`) VALUES (?, 0, 0, 0, 0)", id)
	return err
}

// FindUserByID ...
func (da *TableTypeUser) FindUserByID(queryable mingru.Queryable, id uint64) (FindUserResult, error) {
	var result FindUserResult
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName)
	if err != nil {
		return result, err
	}
	return result, nil
}

// FindUsersByName ...
func (da *TableTypeUser) FindUsersByName(queryable mingru.Queryable, name string) ([]FindUserResult, error) {
	rows, err := queryable.Query("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `name` LIKE ?", name)
	if err != nil {
		return nil, err
	}
	var result []FindUserResult
	defer rows.Close()
	for rows.Next() {
		var item FindUserResult
		err = rows.Scan(&item.ID, &item.Name, &item.IconName)
		if err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UserTableSelectEditingDataResult ...
type UserTableSelectEditingDataResult struct {
	BioHTML  *string `json:"bioHTML,omitempty"`
	Company  string  `json:"company,omitempty"`
	IconName string  `json:"-"`
	ID       uint64  `json:"-"`
	Location string  `json:"location,omitempty"`
	Name     string  `json:"name,omitempty"`
	Website  string  `json:"website,omitempty"`
}

// SelectEditingData ...
func (da *TableTypeUser) SelectEditingData(queryable mingru.Queryable, id uint64) (UserTableSelectEditingDataResult, error) {
	var result UserTableSelectEditingDataResult
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.BioHTML)
	if err != nil {
		return result, err
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

// SelectIsAdmin ...
func (da *TableTypeUser) SelectIsAdmin(queryable mingru.Queryable, id uint64) (bool, error) {
	var result bool
	err := queryable.QueryRow("SELECT `admin` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// SelectName ...
func (da *TableTypeUser) SelectName(queryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := queryable.QueryRow("SELECT `name` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UserTableSelectProfileResult ...
type UserTableSelectProfileResult struct {
	BioHTML  *string `json:"bioHTML,omitempty"`
	Company  string  `json:"company,omitempty"`
	IconName string  `json:"-"`
	ID       uint64  `json:"-"`
	Location string  `json:"location,omitempty"`
	Name     string  `json:"name,omitempty"`
	Website  string  `json:"website,omitempty"`
}

// SelectProfile ...
func (da *TableTypeUser) SelectProfile(queryable mingru.Queryable, id uint64) (UserTableSelectProfileResult, error) {
	var result UserTableSelectProfileResult
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.BioHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UserTableSelectSessionDataResult ...
type UserTableSelectSessionDataResult struct {
	Admin    bool   `json:"admin,omitempty"`
	IconName string `json:"iconName,omitempty"`
	ID       uint64 `json:"id,omitempty"`
	Name     string `json:"name,omitempty"`
}

// SelectSessionData ...
func (da *TableTypeUser) SelectSessionData(queryable mingru.Queryable, id uint64) (UserTableSelectSessionDataResult, error) {
	var result UserTableSelectSessionDataResult
	err := queryable.QueryRow("SELECT `id`, `name`, `icon_name`, `admin` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Admin)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UserTableSelectSessionDataForumModeResult ...
type UserTableSelectSessionDataForumModeResult struct {
	Admin      bool    `json:"admin,omitempty"`
	IconName   string  `json:"iconName,omitempty"`
	ID         uint64  `json:"id,omitempty"`
	IsForumMod *uint64 `json:"isForumMod,omitempty"`
	Name       string  `json:"name,omitempty"`
}

// SelectSessionDataForumMode ...
func (da *TableTypeUser) SelectSessionDataForumMode(queryable mingru.Queryable, id uint64) (UserTableSelectSessionDataForumModeResult, error) {
	var result UserTableSelectSessionDataForumModeResult
	err := queryable.QueryRow("SELECT `user`.`id`, `user`.`name`, `user`.`icon_name`, `user`.`admin`, `join_1`.`id` AS `is_forum_mod` FROM `user` AS `user` LEFT JOIN `forum_is_user_mod` AS `join_1` ON `join_1`.`id` = `user`.`id` WHERE `user`.`id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Admin, &result.IsForumMod)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (da *TableTypeUser) testAddUserChild2(queryable mingru.Queryable, id uint64) error {
	return da.AddUserStatsEntryInternal(queryable, id)
}

// TestAddUser ...
func (da *TableTypeUser) TestAddUser(db *sql.DB, email string, name string) (uint64, error) {
	var insertedUserIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedUserID, err := da.AddUserEntryInternal(tx, email, name)
		if err != nil {
			return err
		}
		err = da.testAddUserChild2(tx, insertedUserID)
		if err != nil {
			return err
		}
		insertedUserIDExported = insertedUserID
		return nil
	})
	return insertedUserIDExported, txErr
}

func (da *TableTypeUser) testEraseUserChild1(queryable mingru.Queryable, id uint64) (int, error) {
	result, err := queryable.Exec("DELETE FROM `user` WHERE `id` = ?", id)
	return mingru.GetRowsAffectedIntWithError(result, err)
}

func (da *TableTypeUser) testEraseUserChild2(queryable mingru.Queryable, id uint64) (int, error) {
	result, err := queryable.Exec("DELETE FROM `user_stats` WHERE `id` = ?", id)
	return mingru.GetRowsAffectedIntWithError(result, err)
}

// TestEraseUser ...
func (da *TableTypeUser) TestEraseUser(db *sql.DB, id uint64) error {
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		_, err = da.testEraseUserChild1(tx, id)
		if err != nil {
			return err
		}
		_, err = da.testEraseUserChild2(tx, id)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}

// UserTableUnsafeSelectAdminsResult ...
type UserTableUnsafeSelectAdminsResult struct {
	IconName string `json:"-"`
	ID       uint64 `json:"-"`
	Name     string `json:"name,omitempty"`
}

// UnsafeSelectAdmins ...
func (da *TableTypeUser) UnsafeSelectAdmins(queryable mingru.Queryable) ([]UserTableUnsafeSelectAdminsResult, error) {
	rows, err := queryable.Query("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `admin` = 1 ORDER BY `id`")
	if err != nil {
		return nil, err
	}
	var result []UserTableUnsafeSelectAdminsResult
	defer rows.Close()
	for rows.Next() {
		var item UserTableUnsafeSelectAdminsResult
		err = rows.Scan(&item.ID, &item.Name, &item.IconName)
		if err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UnsafeUpdateAdmin ...
func (da *TableTypeUser) UnsafeUpdateAdmin(queryable mingru.Queryable, id uint64, admin bool) error {
	result, err := queryable.Exec("UPDATE `user` SET `admin` = ? WHERE `id` = ?", admin, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateIconName ...
func (da *TableTypeUser) UpdateIconName(queryable mingru.Queryable, id uint64, iconName string) error {
	result, err := queryable.Exec("UPDATE `user` SET `icon_name` = ? WHERE `id` = ?", iconName, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

// UpdateProfile ...
func (da *TableTypeUser) UpdateProfile(queryable mingru.Queryable, id uint64, name string, website string, company string, location string, bioHTML *string) error {
	result, err := queryable.Exec("UPDATE `user` SET `name` = ?, `website` = ?, `company` = ?, `location` = ?, `bio` = ? WHERE `id` = ?", name, website, company, location, bioHTML, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
