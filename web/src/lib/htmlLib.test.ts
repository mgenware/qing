/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, html, fixture, elementUpdated, aTimeout } from 'qing-t';
import { html as litHTML } from 'lit-element';
import { renderTemplateResult, tif } from './htmlLib';

it('renderTemplateResult', async () => {
  const el: HTMLElement = await fixture(html`<section><q>1</q></section>`);
  const content = renderTemplateResult(el, litHTML`<p>2</p>`)!;
  await elementUpdated(el);

  expect(el.innerHTML).to.eq('<div><!----><p>2</p><!----></div>');
  expect(content.outerHTML).to.eq('<p>2</p>');
});

it('renderTemplateResult - container with ID', async () => {
  const el: HTMLElement = await fixture(html`<section id="el"><q>1</q></section>`);
  const content = renderTemplateResult('el', litHTML`<p>2</p>`)!;
  await elementUpdated(el);

  expect(el.innerHTML).to.eq('<div><!----><p>2</p><!----></div>');
  expect(content.outerHTML).to.eq('<p>2</p>');
});

it('renderTemplateResult - create an element by ID', async () => {
  const content = renderTemplateResult('new-el', litHTML`<p>2</p>`)!;
  await aTimeout(50);

  expect(document.getElementById('new-el')?.outerHTML).to.eq(
    '<div id="new-el"><div><!----><p>2</p><!----></div></div>',
  );
  expect(content.outerHTML).to.eq('<p>2</p>');
});

it('renderTemplateResult - empty ID', async () => {
  const el1 = renderTemplateResult('', litHTML`<p>1</p>`)!;
  const el2 = renderTemplateResult('', litHTML`<p>2</p>`)!;
  await aTimeout(50);

  expect(document.getElementById('__r_tpl_slot_1')?.outerHTML).to.eq(
    '<div id="__r_tpl_slot_1"><div><!----><p>1</p><!----></div></div>',
  );
  expect(document.getElementById('__r_tpl_slot_2')?.outerHTML).to.eq(
    '<div id="__r_tpl_slot_2"><div><!----><p>2</p><!----></div></div>',
  );
  expect(el1.outerHTML).to.eq('<p>1</p>');
  expect(el2.outerHTML).to.eq('<p>2</p>');
});

it('tif', async () => {
  expect(tif(1, 'haha')).to.eq('haha');
  expect(tif(0, 'haha')).to.eq('');
  expect(tif(false, 'haha')).to.eq('');
  expect(tif('', 'haha')).to.eq('');
});
