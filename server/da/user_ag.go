/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
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

type UserAGType struct {
}

var User = &UserAGType{}

// ------------ Actions ------------

func (mrTable *UserAGType) AddUserEntryInternal(mrQueryable mingru.Queryable, email string, name string, regLang string) (uint64, error) {
	result, err := mrQueryable.Exec("INSERT INTO `user` (`email`, `name`, `icon_name`, `created_at`, `company`, `website`, `location`, `bio`, `bio_src`, `lang`, `reg_lang`, `admin`) VALUES (?, ?, '', NOW(3), '', '', '', NULL, NULL, '', ?, 0)", email, name, regLang)
	return mingru.GetLastInsertIDUint64WithError(result, err)
}

func (mrTable *UserAGType) AddUserStatsEntryInternal(mrQueryable mingru.Queryable, id uint64) error {
	_, err := mrQueryable.Exec("INSERT INTO `user_stats` (`id`, `post_count`, `fpost_count`) VALUES (?, 0, 0)", id)
	return err
}

func (mrTable *UserAGType) FindUserByID(mrQueryable mingru.Queryable, id uint64) (FindUserResult, error) {
	var result FindUserResult
	err := mrQueryable.QueryRow("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) FindUsersByName(mrQueryable mingru.Queryable, name string) ([]FindUserResult, error) {
	rows, err := mrQueryable.Query("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `name` LIKE ?", name)
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

type UserAGSelectEditingDataResult struct {
	BioHTML  *string `json:"bioHTML,omitempty"`
	BioSrc   *string `json:"bioSrc,omitempty"`
	Company  string  `json:"company,omitempty"`
	IconName string  `json:"-"`
	ID       uint64  `json:"-"`
	Location string  `json:"location,omitempty"`
	Name     string  `json:"name,omitempty"`
	Website  string  `json:"website,omitempty"`
}

func (mrTable *UserAGType) SelectEditingData(mrQueryable mingru.Queryable, id uint64) (UserAGSelectEditingDataResult, error) {
	var result UserAGSelectEditingDataResult
	err := mrQueryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio`, `bio_src` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.BioHTML, &result.BioSrc)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) SelectEmail(mrQueryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := mrQueryable.QueryRow("SELECT `email` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) SelectIconName(mrQueryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := mrQueryable.QueryRow("SELECT `icon_name` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) SelectIDFromEmail(mrQueryable mingru.Queryable, email string) (uint64, error) {
	var result uint64
	err := mrQueryable.QueryRow("SELECT `id` FROM `user` WHERE `email` = ?", email).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) SelectIsAdmin(mrQueryable mingru.Queryable, id uint64) (bool, error) {
	var result bool
	err := mrQueryable.QueryRow("SELECT `admin` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) SelectLang(mrQueryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := mrQueryable.QueryRow("SELECT `lang` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

type UserAGSelectLangsAndEmailResult struct {
	Email   string `json:"email,omitempty"`
	Lang    string `json:"lang,omitempty"`
	RegLang string `json:"regLang,omitempty"`
}

func (mrTable *UserAGType) SelectLangsAndEmail(mrQueryable mingru.Queryable, id uint64) (UserAGSelectLangsAndEmailResult, error) {
	var result UserAGSelectLangsAndEmailResult
	err := mrQueryable.QueryRow("SELECT `lang`, `reg_lang`, `email` FROM `user` WHERE `id` = ?", id).Scan(&result.Lang, &result.RegLang, &result.Email)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) SelectName(mrQueryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := mrQueryable.QueryRow("SELECT `name` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

type UserAGSelectProfileResult struct {
	BioHTML  *string `json:"bioHTML,omitempty"`
	Company  string  `json:"company,omitempty"`
	IconName string  `json:"-"`
	ID       uint64  `json:"-"`
	Location string  `json:"location,omitempty"`
	Name     string  `json:"name,omitempty"`
	Website  string  `json:"website,omitempty"`
}

func (mrTable *UserAGType) SelectProfile(mrQueryable mingru.Queryable, id uint64) (UserAGSelectProfileResult, error) {
	var result UserAGSelectProfileResult
	err := mrQueryable.QueryRow("SELECT `id`, `name`, `icon_name`, `location`, `company`, `website`, `bio` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Location, &result.Company, &result.Website, &result.BioHTML)
	if err != nil {
		return result, err
	}
	return result, nil
}

type UserAGSelectSessionDataResult struct {
	Admin    bool   `json:"admin,omitempty"`
	IconName string `json:"iconName,omitempty"`
	ID       uint64 `json:"id,omitempty"`
	Lang     string `json:"lang,omitempty"`
	Name     string `json:"name,omitempty"`
}

func (mrTable *UserAGType) SelectSessionData(mrQueryable mingru.Queryable, id uint64) (UserAGSelectSessionDataResult, error) {
	var result UserAGSelectSessionDataResult
	err := mrQueryable.QueryRow("SELECT `id`, `name`, `icon_name`, `admin`, `lang` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Admin, &result.Lang)
	if err != nil {
		return result, err
	}
	return result, nil
}

type UserAGSelectSessionDataForumModeResult struct {
	Admin      bool    `json:"admin,omitempty"`
	IconName   string  `json:"iconName,omitempty"`
	ID         uint64  `json:"id,omitempty"`
	IsForumMod *uint64 `json:"isForumMod,omitempty"`
	Lang       string  `json:"lang,omitempty"`
	Name       string  `json:"name,omitempty"`
}

func (mrTable *UserAGType) SelectSessionDataForumMode(mrQueryable mingru.Queryable, id uint64) (UserAGSelectSessionDataForumModeResult, error) {
	var result UserAGSelectSessionDataForumModeResult
	err := mrQueryable.QueryRow("SELECT `user`.`id`, `user`.`name`, `user`.`icon_name`, `user`.`admin`, `user`.`lang`, `join_1`.`id` AS `is_forum_mod` FROM `user` AS `user` LEFT JOIN `forum_is_user_mod` AS `join_1` ON `join_1`.`id` = `user`.`id` WHERE `user`.`id` = ?", id).Scan(&result.ID, &result.Name, &result.IconName, &result.Admin, &result.Lang, &result.IsForumMod)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserAGType) testAddUserChild2(mrQueryable mingru.Queryable, id uint64) error {
	return mrTable.AddUserStatsEntryInternal(mrQueryable, id)
}

func (mrTable *UserAGType) TestAddUser(db *sql.DB, email string, name string, regLang string) (uint64, error) {
	var insertedUserIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedUserID, err := mrTable.AddUserEntryInternal(tx, email, name, regLang)
		if err != nil {
			return err
		}
		err = mrTable.testAddUserChild2(tx, insertedUserID)
		if err != nil {
			return err
		}
		insertedUserIDExported = insertedUserID
		return nil
	})
	return insertedUserIDExported, txErr
}

func (mrTable *UserAGType) TestDelete(mrQueryable mingru.Queryable, id uint64) (int, error) {
	result, err := mrQueryable.Exec("DELETE FROM `user` WHERE `id` = ?", id)
	return mingru.GetRowsAffectedIntWithError(result, err)
}

type UserAGUnsafeSelectAdminsResult struct {
	IconName string `json:"-"`
	ID       uint64 `json:"-"`
	Name     string `json:"name,omitempty"`
}

func (mrTable *UserAGType) UnsafeSelectAdmins(mrQueryable mingru.Queryable) ([]UserAGUnsafeSelectAdminsResult, error) {
	rows, err := mrQueryable.Query("SELECT `id`, `name`, `icon_name` FROM `user` WHERE `admin` = 1 ORDER BY `id`")
	if err != nil {
		return nil, err
	}
	var result []UserAGUnsafeSelectAdminsResult
	defer rows.Close()
	for rows.Next() {
		var item UserAGUnsafeSelectAdminsResult
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

func (mrTable *UserAGType) UnsafeUpdateAdmin(mrQueryable mingru.Queryable, id uint64, admin bool) error {
	result, err := mrQueryable.Exec("UPDATE `user` SET `admin` = ? WHERE `id` = ?", admin, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *UserAGType) UpdateIconName(mrQueryable mingru.Queryable, id uint64, iconName string) error {
	result, err := mrQueryable.Exec("UPDATE `user` SET `icon_name` = ? WHERE `id` = ?", iconName, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *UserAGType) UpdateLang(mrQueryable mingru.Queryable, id uint64, lang string) error {
	result, err := mrQueryable.Exec("UPDATE `user` SET `lang` = ? WHERE `id` = ?", lang, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}

func (mrTable *UserAGType) UpdateProfile(mrQueryable mingru.Queryable, id uint64, name string, website string, company string, location string, bioHTML *string) error {
	result, err := mrQueryable.Exec("UPDATE `user` SET `name` = ?, `website` = ?, `company` = ?, `location` = ?, `bio` = ? WHERE `id` = ?", name, website, company, location, bioHTML, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
