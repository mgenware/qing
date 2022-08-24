/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Element } from 'br';

const inputErrorViewSel = 'input-error-view';

export interface InputViewProps {
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: string;
  minLength?: number;
  maxLength?: number;
}

export async function shouldHaveProps(el: Element, props: InputViewProps) {
  if (props.required !== undefined) {
    if (props.required) {
      await el.e.toHaveAttribute('required', '');
    } else {
      await el.e.not.toHaveAttribute('required', '');
    }
  }
  await el.shouldHaveAttrOrNot('type', props.type);
  await el.shouldHaveAttrOrNot('autocomplete', props.autoComplete);
  await el.shouldHaveAttrOrNot('inputmode', props.inputMode);
  await el.shouldHaveAttrOrNot('minlength', props.minLength?.toString());
  await el.shouldHaveAttrOrNot('maxlength', props.maxLength?.toString());
}

export async function shouldHaveError(el: Element, err: string) {
  const iev = el.$(inputErrorViewSel);
  await iev.e.toHaveAttribute('message', err);
  await iev.e.toBeVisible();
}

export async function shouldHaveRequiredError(el: Element) {
  return shouldHaveError(el, 'Please fill out this field.');
}

export function shouldNotHaveError(el: Element) {
  return el.$(inputErrorViewSel).shouldNotExist();
}

export async function shouldHaveValue(el: Element, val: string) {
  await el.$('input').e.toHaveValue(val);
}

export function shouldBeEmpty(el: Element) {
  return shouldHaveValue(el, '');
}
