/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api } from 'api.js';
import * as mailAPI from '@qing/routes/dev/api/mail.js';
import { HTMLElement, parse } from 'node-html-parser';
import { serverURL } from 'base/def.js';

const mainElSel = '#main';

export interface DevMail {
  id: string;
  title: string;
  content: string;
  ts: number;
}

export function get(e: { email: string; id: string }) {
  return api<DevMail>(mailAPI.get, e, null);
}

export function getLatest(e: { email: string; index?: number }) {
  return api<DevMail>(mailAPI.getLatest, e, null);
}

export function erase(e: { email: string }) {
  return api<DevMail>(mailAPI.eraseUser, e, null);
}

export function eraseByID(e: { id: string }) {
  return api<DevMail>(mailAPI.eraseUserByID, e, null);
}

export type SendMailData = {
  to: string;
  title: string;
  content: string;
};

export function sendRealMail(e: SendMailData) {
  return api<DevMail>(mailAPI.sendRealMail, e, null);
}

export function sendDevMail(e: SendMailData) {
  return api<DevMail>(mailAPI.sendDevMail, e, null);
}

export function getErrorContent(page: string) {
  const root = parse(page);
  const errEl = root.querySelector('.text-danger');
  if (errEl?.textContent) {
    return errEl.textContent.trim();
  }
  throw new Error('No error element found');
}

export function getContentElement(page: string) {
  const root = parse(page);
  const element = root.querySelector(mainElSel);
  if (!element) {
    throw new Error('No content element found');
  }
  return element;
}

export function getContentHTML(page: string) {
  return getContentElement(page).innerHTML;
}

export function getContentText(page: string) {
  return getContentElement(page).textContent;
}

export function getContentLinkFromElement(element: HTMLElement) {
  const link = element.querySelector('a')?.getAttribute('href');
  if (!link) {
    throw new Error('No link found');
  }
  return link;
}

export function getContentRawLink(page: string) {
  const element = getContentElement(page);
  return getContentLinkFromElement(element);
}

export function getContentLink(page: string) {
  const link = getContentRawLink(page);
  const url = new URL(link);
  return serverURL + url.pathname + url.search;
}
