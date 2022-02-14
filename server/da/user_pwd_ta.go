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

type TableTypeUserPwd struct {
}

var UserPwd = &TableTypeUserPwd{}

// MingruSQLName returns the name of this table.
func (mrTable *TableTypeUserPwd) MingruSQLName() string {
	return "user_pwd"
}

// ------------ Actions ------------

func (mrTable *TableTypeUserPwd) addPwdBasedUserChild2(mrQueryable mingru.Queryable, id uint64) error {
	return User.AddUserStatsEntryInternal(mrQueryable, id)
}

func (mrTable *TableTypeUserPwd) addPwdBasedUserChild3(mrQueryable mingru.Queryable, id uint64) error {
	return UserAuth.AddUserAuth(mrQueryable, id, 1)
}

func (mrTable *TableTypeUserPwd) addPwdBasedUserChild4(mrQueryable mingru.Queryable, id uint64, pwdHash string) error {
	return mrTable.AddUserPwdInternal(mrQueryable, id, pwdHash)
}

func (mrTable *TableTypeUserPwd) AddPwdBasedUser(db *sql.DB, email string, name string, pwdHash string) (uint64, error) {
	var insertedUserIDExported uint64
	txErr := mingru.Transact(db, func(tx *sql.Tx) error {
		var err error
		insertedUserID, err := User.AddUserEntryInternal(tx, email, name)
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

func (mrTable *TableTypeUserPwd) AddUserPwdInternal(mrQueryable mingru.Queryable, id uint64, pwdHash string) error {
	_, err := mrQueryable.Exec("INSERT INTO `user_pwd` (`id`, `pwd_hash`) VALUES (?, ?)", id, pwdHash)
	return err
}

func (mrTable *TableTypeUserPwd) SelectHashByID(mrQueryable mingru.Queryable, id uint64) (string, error) {
	var result string
	err := mrQueryable.QueryRow("SELECT `pwd_hash` FROM `user_pwd` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}
