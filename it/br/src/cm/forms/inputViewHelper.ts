/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
import { BRElement } from 'br.js';

const inputErrorViewSel = 'input-error-view';

export interface InputViewProps {
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: string;
  minLength?: number;
  maxLength?: number;
}

export async function shouldHaveProps(el: BRElement, props: InputViewProps) {
  if (props.required !== undefined) {
    if (props.required) {
      await expect(el.c).toHaveAttribute('required', '');
    } else {
      await expect(el.c).not.toHaveAttribute('required', '');
    }
  }
  await el.shouldHaveAttrOrNot('type', props.type);
  await el.shouldHaveAttrOrNot('autocomplete', props.autoComplete);
  await el.shouldHaveAttrOrNot('inputmode', props.inputMode);
  await el.shouldHaveAttrOrNot('minlength', props.minLength?.toString());
  await el.shouldHaveAttrOrNot('maxlength', props.maxLength?.toString());
}

export async function shouldHaveError(el: BRElement, err: string) {
  const iev = el.$(inputErrorViewSel);
  await expect(iev.c).toContainText(err, { ignoreCase: true });
  await expect(iev.c).toBeVisible();
}

export async function shouldHaveRequiredError(el: BRElement) {
  return shouldHaveError(el, 'fill out this field');
}

export function shouldNotHaveError(el: BRElement) {
  return el.$(inputErrorViewSel).shouldNotExist();
}

export async function shouldHaveValue(el: BRElement, val: string) {
  await expect(el.$('input').c).toHaveValue(val);
}

export function shouldBeEmpty(el: BRElement) {
  return shouldHaveValue(el, '');
}
