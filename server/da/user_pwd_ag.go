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

type UserPwdAGType struct {
}

var UserPwd = &UserPwdAGType{}

// ------------ Actions ------------

func (mrTable *UserPwdAGType) addPwdBasedUserChild2(mrQueryable mingru.Queryable, id uint64) error {
	return User.AddUserStatsEntryInternal(mrQueryable, id)
}

func (mrTable *UserPwdAGType) addPwdBasedUserChild3(mrQueryable mingru.Queryable, id uint64) error {
	return UserAuth.AddUserAuth(mrQueryable, id, 1)
}

func (mrTable *UserPwdAGType) addPwdBasedUserChild4(mrQueryable mingru.Queryable, id uint64, pwdHash string) error {
	return mrTable.AddUserPwdInternal(mrQueryable, id, pwdHash)
}

func (mrTable *UserPwdAGType) AddPwdBasedUser(db *sql.DB, email string, name string, regLang string, pwdHash string) (uint64, error) {
	var insertedUserIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedUserID, err := User.AddUserEntryInternal(tx, email, name, regLang)
		if err != nil {
			return err
		}
		err = mrTable.addPwdBasedUserChild2(tx, insertedUserID)
		if err != nil {
			return err
		}
		err = mrTable.addPwdBasedUserChild3(tx, insertedUserID)
		if err != nil {
			return err
		}
		err = mrTable.addPwdBasedUserChild4(tx, insertedUserID, pwdHash)
		if err != nil {
			return err
		}
		insertedUserIDExported = insertedUserID
		return nil
	})
	return insertedUserIDExported, txErr
}

func (mrTable *UserPwdAGType) AddUserPwdInternal(mrQueryable mingru.Queryable, id uint64, pwdHash string) error {
	_, err := mrQueryable.Exec("INSERT INTO `user_pwd` (`id`, `pwd_hash`) VALUES (?, ?)", id, pwdHash)
	return err
}

func (mrTable *UserPwdAGType) HasUser(mrQueryable mingru.Queryable, id uint64) (bool, error) {
	var result bool
	err := mrQueryable.QueryRow("SELECT EXISTS(SELECT * FROM `user_pwd` WHERE `id` = ?)", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserPwdAGType) SelectHashByID(mrQueryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := mrQueryable.QueryRow("SELECT `pwd_hash` FROM `user_pwd` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (mrTable *UserPwdAGType) TestDelete(mrQueryable mingru.Queryable, id uint64) (int, error) {
	result, err := mrQueryable.Exec("DELETE FROM `user_pwd` WHERE `id` = ?", id)
	return mingru.GetRowsAffectedIntWithError(result, err)
}

func (mrTable *UserPwdAGType) UpdateHashByID(mrQueryable mingru.Queryable, id uint64, pwdHash string) error {
	result, err := mrQueryable.Exec("UPDATE `user_pwd` SET `pwd_hash` = ? WHERE `id` = ?", pwdHash, id)
	return mingru.CheckOneRowAffectedWithError(result, err)
}
