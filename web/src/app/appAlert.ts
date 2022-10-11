/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import ls from 'ls';
import { renderTemplateResult } from 'lib/htmlLib';
import { html } from 'll';
import { brMode } from 'devMode';
import 'ui/status/spinnerView';
import 'ui/alerts/dialogView';
import 'com/share/sharePopup';
import { DialogIcon, DialogView } from 'ui/alerts/dialogView';
import delay from 'lib/delay';

const dialogContainerID = '__g_dialog_container';
const spinnerContainerID = '__g_spinner_container';
const shareContainerID = '__g_share_container';

// BR tests only. Used to make sure global spinner appears for at least 500 ms.
let brGlobalSpinnerStartTime = 0;

export interface SharePopupOptions {
  noAutoDomain?: boolean;
}

export class AppAlert {
  async error(message: string, title?: string): Promise<void> {
    await this.showDialogViewAsync({
      message,
      title: title || ls.error,
      buttons: [ls.ok],
      icon: DialogIcon.error,
      defaultButtonIndex: 0,
      cancelButtonIndex: 0,
    });
  }

  async warn(message: string, title?: string): Promise<void> {
    await this.showDialogViewAsync({
      message,
      title: title || ls.warning,
      buttons: [ls.ok],
      icon: DialogIcon.warning,
      defaultButtonIndex: 0,
      cancelButtonIndex: 0,
    });
  }

  async successToast(title: string): Promise<void> {
    await this.showDialogViewAsync({
      message: '',
      title: title || ls.error,
      buttons: [],
      icon: DialogIcon.success,
      timeout: 2000,
    });
  }

  async confirm(title: string, message: string, hasCancelButton = false): Promise<boolean | null> {
    const buttons = [ls.yes, ls.no];
    // Default button is "No".
    let defaultBtnIdx = 1;
    if (hasCancelButton) {
      buttons.push(ls.cancel);
      // Default button is "Cancel" if it's present.
      defaultBtnIdx = 2;
    }
    const button = await this.showDialogViewAsync({
      message,
      title,
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

  async warnUnsavedChanges(): Promise<boolean> {
    return (
      (await this.confirm(ls.doYouWantDoDiscardYourChanges, ls.youHaveNotSavedYourChanges)) ?? false
    );
  }

  // Shows the global loading spinner.
  async showLoadingOverlay(text: string) {
    await this.hideLoadingOverlay();

    const template = html`<spinner-view .fullScreen=${true}>${text}</spinner-view>`;
    renderTemplateResult(spinnerContainerID, template);

    if (brMode()) {
      brGlobalSpinnerStartTime = new Date().getTime();
    }
  }

  // Hides the global loading spinner.
  async hideLoadingOverlay() {
    if (brMode()) {
      const runFor = new Date().getTime() - brGlobalSpinnerStartTime;
      if (runFor < 500) {
        await delay(500 - runFor);
      }
      brGlobalSpinnerStartTime = 0;
    }
    renderTemplateResult(spinnerContainerID, null);
  }

  showSharePopup(link: string, opt?: SharePopupOptions) {
    const template = html`<share-popup
      open
      .link=${link}
      ?noAutoDomain=${opt?.noAutoDomain}></share-popup>`;
    const el = renderTemplateResult(shareContainerID, template);
    // Fix "OK" button not focusing.
    setTimeout(() => el?.focus(), 0);
  }

  private showDialogViewAsync(args: {
    message: string;
    title: string;
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
        .dialogTitle=${args.title}
        .message=${args.message}
        @dialog-close=${(e: CustomEvent<number>) => {
          resolve(e.detail);
          renderTemplateResult(dialogContainerID, null);
        }}></dialog-view>`;

      const dialogView = renderTemplateResult<DialogView>(dialogContainerID, template);
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
