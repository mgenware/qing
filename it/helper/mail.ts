/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api } from 'api.js';
import * as mailAPI from '@qing/routes/dev/api/mail.js';

const contentRegex = /<td id="main">(.*?)<\/td>/;

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

// NOTE: `err` is not escaped.
export function unsafeErrorHTML(err: string) {
  return `<div class="container section">
  <div class="text-center">
    <h1>An error occurred</h1>
    <p class="text-danger">${err}</p>
  </div>
</div>`;
}

// Gets the main content HTML from email HTML.
export function getContentHTML(html: string) {
  const m = html.match(contentRegex);
  if (!m) {
    return '';
  }
  return m[1] ?? '';
}

// Extracts email content link from HTML.
export function extractContentLink(html: string, emailLinkRegex: RegExp) {
  const match = html.match(emailLinkRegex);
  if (!match) {
    throw new Error('Cannot find email link');
  }
  const link = match[1];
  if (!link) {
    throw new Error('Unexpected empty link');
  }
  // Return relative URL.
  const urlObj = new URL(link);
  return urlObj.pathname + urlObj.search;
}
