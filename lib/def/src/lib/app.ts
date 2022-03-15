/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export const minUserPwdLen = 6;
export const maxUserPwdLen = 30;
export const maxCaptchaLen = 10;
export const maxGenericStringLen = 100;
export const errInvalidUserOrPwd = 1;
export const errCannotSetAdminOfYourself = 1;
export const errAlreadyAdmin = 2;
export const columnCreated = 'createdAt';
export const columnLikes = 'likes';
export const columnComments = 'comments';
export const columnMessages = 'messages';
export const routeUser = 'u';
export const routePost = 'p';
export const routeAuth = 'auth';
export const routeDevPage = '__';
export const routeM = 'm';
export const routeMX = 'mx';
export const routeAPI = 's';
export const routeForum = 'f';
export const routeDiscussion = 'd';
export const routeForumGroup = 'g';
export const routeQuestion = 'q';
export const routeAnswer = 'a';
export const routeLang = 'lang';
export const errGeneric = 10000;
export const errNeedAuth = 10001;
export const errCaptchaNotFound = 10002;
export const errCaptchaNotMatch = 10003;
export const errPermissionDenied = 10004;
export const errResourceNotFound = 10005;
export const keyPosts = 'posts';
export const keyDiscussions = 'discussions';
export const keyAnswers = 'answers';
export const keyPage = 'page';
export const keyPageSize = 'pageSize';
export const keyTab = 'tab';
export const keyValue = 'value';
export const keyQuestions = 'questions';
export const keyCommunitySettings = 'communitySettings';
export const keyLang = 'lang';
export const forumStatusOpen = 0;
export const forumStatusArchived = 1;
export const upVoteValue = 1;
export const downVoteValue = -1;
export const noVoteValue = 0;
export const maxTitleLen = 200;
export const maxEmailLen = 200;
export const maxNameLen = 100;
export const maxFileNameLen = 255;
export const maxUserInfoFieldLen = 100;
export const maxURLLen = 200;
export const maxPwdHashLen = 255;
export const formUploadMain = 'main';
export const deleteFlagAuthor = 1;
export const deleteFlagHost = 2;
export const likeHostPost = 1;
export const likeHostQuestion = 2;
export const likeHostDiscussion = 3;
export const likeHostAnswer = 4;
export const likeHostCmt = 5;
