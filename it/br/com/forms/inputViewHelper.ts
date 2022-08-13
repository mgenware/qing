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
  if (props.type !== undefined) {
    await el.e.toHaveAttribute('type', props.type);
  }
  if (props.autoComplete !== undefined) {
    await el.e.toHaveAttribute('autocomplete', props.autoComplete);
  }
  if (props.inputMode !== undefined) {
    await el.e.toHaveAttribute('inputmode', props.inputMode);
  }
  if (props.minLength !== undefined) {
    await el.e.toHaveAttribute('minlength', props.minLength.toString());
  }
  if (props.maxLength !== undefined) {
    await el.e.toHaveAttribute('maxlength', props.maxLength.toString());
  }
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
  await el.e.toHaveAttribute('value', val);
}

export function shouldBeEmpty(el: Element) {
  return shouldHaveValue(el, '');
}
