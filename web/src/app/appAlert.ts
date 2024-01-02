/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { renderTemplateResult } from 'lib/htmlLib.js';
import { html } from 'll.js';
import 'ui/alerts/dialogView.js';
import { DialogIcon, DialogView } from 'ui/alerts/dialogView.js';

// App-wide alert utils.
export class AppAlert {
  async info(message: string): Promise<void> {
    await this.showDialogViewAsync({
      message,
      buttons: [globalThis.coreLS.ok],
      icon: DialogIcon.info,
      defaultButtonIndex: 0,
      cancelButtonIndex: 0,
    });
  }

  async error(message: string): Promise<void> {
    await this.showDialogViewAsync({
      message,
      buttons: [globalThis.coreLS.ok],
      icon: DialogIcon.error,
      defaultButtonIndex: 0,
      cancelButtonIndex: 0,
    });
  }

  async warn(message: string): Promise<void> {
    await this.showDialogViewAsync({
      message,
      buttons: [globalThis.coreLS.ok],
      icon: DialogIcon.warning,
      defaultButtonIndex: 0,
      cancelButtonIndex: 0,
    });
  }

  async successToast(message: string): Promise<void> {
    await this.showDialogViewAsync({
      message,
      buttons: [],
      icon: DialogIcon.success,
      timeout: 2000,
    });
  }

  async confirm(message: string, hasCancelButton = false): Promise<boolean | null> {
    const buttons = [globalThis.coreLS.yes, globalThis.coreLS.no];
    // Default button is "No".
    let defaultBtnIdx = 1;
    if (hasCancelButton) {
      buttons.push(globalThis.coreLS.cancel);
      // Default button is "Cancel" if it's present.
      defaultBtnIdx = 2;
    }
    const button = await this.showDialogViewAsync({
      message,
      buttons,
      icon: DialogIcon.warning,
      defaultButtonIndex: defaultBtnIdx,
      cancelButtonIndex: defaultBtnIdx,
    });
    // Yes
    if (button === 0) {
      return true;
    }
    // No
    if (button === 1) {
      return false;
    }
    // Cancel
    return null;
  }

  private showDialogViewAsync(args: {
    message: string;
    buttons: string[];
    icon: DialogIcon;
    defaultButtonIndex?: number;
    cancelButtonIndex?: number;
    timeout?: number;
  }): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const template = html`<dialog-view
        open
        .buttons=${args.buttons}
        .defaultButton=${args.defaultButtonIndex ?? -1}
        .cancelButton=${args.cancelButtonIndex ?? -1}
        .icon=${args.icon}
        .message=${args.message}
        @dialog-close=${(e: CustomEvent<number>) => {
          resolve(e.detail);
          // Remove the dialog element.
          if (e.currentTarget instanceof DialogView) {
            // We are mounting the dialog via `renderTemplateResult`, which creates a wrapper
            // div inside `body > main`. We need to remove that wrapper div.
            e.currentTarget.parentElement?.remove();
          }
        }}></dialog-view>`;

      const dialogView = renderTemplateResult<DialogView>(null, template);
      if (!dialogView) {
        reject(new Error('Unexpected empty modal element'));
        return;
      }
      const { timeout } = args;
      if (timeout && timeout > 0) {
        setTimeout(() => {
          dialogView.open = false;
        }, timeout);
      }
    });
  }
}

const appAlert = new AppAlert();
export default appAlert;
