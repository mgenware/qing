/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api } from 'api.js';
import * as mailAPI from '@qing/routes/dev/api/mails.js';
import { parse } from 'node-html-parser';

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

export function sendReal(e: { to: string; title: string; content: string }) {
  return api<DevMail>(mailAPI.send, e, null);
}

// Extracts mail content HTML from page HTML.
export function getMainEmailContentHTML(page: string) {
  const root = parse(page);
  const mainEl = root.querySelector(mainElSel);
  return (mainEl?.innerHTML ?? '').trim();
}

export function getMainEmailContentElement(page: string) {
  const root = parse(page);
  return root.querySelector(mainElSel);
}

// NOTE: `err` is not escaped.
export function unsafeErrorHTML(err: string) {
  return `<div class="container section">
  <div class="text-center">
    <h1>An error occurred</h1>
    <p class="text-danger">${err}</p>
  </div>
</div>`;
}
