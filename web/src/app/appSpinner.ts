/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html } from 'll.js';
import { renderTemplateResult } from 'lib/htmlLib.js';
import { brMode } from 'devMode.js';

const spinnerContainerID = '__g_spinner_container';
const brGSpinnerTextAttr = 'data-br-spinner-text';
const brGSpinnerCounterAttr = 'data-br-spinner-counter';

export class AppSpinner {
  // Shows the global loading spinner.
  showLoadingOverlay(text: string) {
    this.hideLoadingOverlay();

    const template = html`<spinner-view .fullScreen=${true}>${text}</spinner-view>`;
    renderTemplateResult(spinnerContainerID, template);

    if (brMode()) {
      // In BR mode, we will do the following things to mimic a global spinner.
      // Get spinner-counter-attr and add it by 1, say `val`.
      // Set spinner-counter-attr to `-val` to indicate it's running.
      // Set spinner-counter-text to current text of the spinner.
      // Set spinner-counter-attr to `val` after completion.
      // spinner-counter-text remains for tests to check the value after completion.
      const val = (parseInt(document.body.getAttribute(brGSpinnerCounterAttr) ?? '0', 10) || 0) + 1;
      document.body.setAttribute(brGSpinnerCounterAttr, `-${val}`);
      document.body.setAttribute(brGSpinnerTextAttr, text);
    }
  }

  // Hides the global loading spinner.
  hideLoadingOverlay() {
    renderTemplateResult(spinnerContainerID, null);
    if (brMode()) {
      const val = parseInt(document.body.getAttribute(brGSpinnerCounterAttr) ?? '0', 10) || 0;
      document.body.setAttribute(brGSpinnerCounterAttr, `${Math.abs(val)}`);
    }
  }
}

const appSpinner = new AppSpinner();
export default appSpinner;
