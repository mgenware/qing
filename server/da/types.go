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
	"time"

	"github.com/mgenware/mingru-go-lib"
)

// ------------ Result types ------------

type CmtResult struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ContentHTML   string    `json:"contentHTML,omitempty"`
	DelFlag       uint8     `json:"delFlag,omitempty"`
	ID            uint64    `json:"-"`
	IsLiked       *uint64   `json:"isLiked,omitempty"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	UserIconName  *string   `json:"-"`
	UserID        *uint64   `json:"-"`
	UserName      *string   `json:"userName,omitempty"`
}

type EntityGetSrcResult struct {
	ContentHTML string `json:"contentHTML,omitempty"`
	Title       string `json:"title,omitempty"`
}

type FindUserResult struct {
	IconName string `json:"-"`
	ID       uint64 `json:"-"`
	Name     string `json:"name,omitempty"`
}

type PostForPostCenter struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ForumID       *uint64   `json:"forumID,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

type PostItem struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ContentHTML   string    `json:"contentHTML,omitempty"`
	ForumID       *uint64   `json:"forumID,omitempty"`
	ID            uint64    `json:"-"`
	Likes         uint      `json:"likes,omitempty"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
	UserIconName  string    `json:"-"`
	UserID        uint64    `json:"-"`
	UserName      string    `json:"-"`
}

type PostItemForProfile struct {
	CmtCount      uint      `json:"cmtCount,omitempty"`
	ForumID       *uint64   `json:"forumID,omitempty"`
	ID            uint64    `json:"-"`
	RawCreatedAt  time.Time `json:"-"`
	RawModifiedAt time.Time `json:"-"`
	Title         string    `json:"title,omitempty"`
}

type ThreadFeedResult struct {
	CmtCount      uint       `json:"cmtCount,omitempty"`
	ID            uint64     `json:"-"`
	LastRepliedAt *time.Time `json:"lastRepliedAt,omitempty"`
	Likes         uint       `json:"likes,omitempty"`
	RawCreatedAt  time.Time  `json:"-"`
	RawModifiedAt time.Time  `json:"-"`
	Title         string     `json:"title,omitempty"`
	UserIconName  string     `json:"-"`
	UserID        uint64     `json:"-"`
	UserName      string     `json:"-"`
}

// ------------ Interfaces ------------

type CmtHostTableInterface interface {
	SelectReplies(mrQueryable mingru.Queryable, parentID *uint64, page int, pageSize int, orderBy1 CmtAGSelectRepliesOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error)
	SelectRepliesUserMode(mrQueryable mingru.Queryable, viewerUserID uint64, parentID *uint64, page int, pageSize int, orderBy1 CmtAGSelectRepliesUserModeOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error)
	SelectRepliesUserModeFilterMode(mrQueryable mingru.Queryable, viewerUserID uint64, parentID *uint64, excluded []uint64, page int, pageSize int, orderBy1 CmtAGSelectRepliesUserModeFilterModeOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error)
	SelectRootCmts(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, hostID uint64, page int, pageSize int, orderBy1 ContentBaseCmtStaticAGSelectRootCmtsOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error)
	SelectRootCmtsUserMode(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, viewerUserID uint64, hostID uint64, page int, pageSize int, orderBy1 ContentBaseCmtStaticAGSelectRootCmtsUserModeOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error)
	SelectRootCmtsUserModeFilterMode(mrQueryable mingru.Queryable, contentBaseCmtTableParam mingru.Table, viewerUserID uint64, hostID uint64, excluded []uint64, page int, pageSize int, orderBy1 ContentBaseCmtStaticAGSelectRootCmtsUserModeFilterModeOrderBy1, orderBy1Desc bool) ([]CmtResult, bool, error)
}

type LikeInterface interface {
	CancelLike(db *sql.DB, hostID uint64, userID uint64) error
	HasLiked(mrQueryable mingru.Queryable, hostID uint64, userID uint64) (bool, error)
	Like(db *sql.DB, hostID uint64, userID uint64) error
}
