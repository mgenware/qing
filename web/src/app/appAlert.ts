/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import ls from 'ls';
import { renderTemplateResult } from 'lib/htmlLib';
import { html } from 'll';
import 'ui/status/spinnerView';
import 'ui/alerts/dialogView';
import { DialogIcon, DialogView } from 'ui/alerts/dialogView';

const dialogContainerID = '__global_dialog_container';
const spinnerContainerID = '__global_spinner_container';

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
  showLoadingOverlay(text: string) {
    this.hideLoadingOverlay();

    const template = html`<spinner-view .fullScreen=${true}>${text}</spinner-view>`;
    renderTemplateResult(spinnerContainerID, template);
  }

  // Hides the global loading spinner.
  hideLoadingOverlay() {
    renderTemplateResult(spinnerContainerID, null);
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
        .title=${args.title}
        .message=${args.message}
        @dialogClosed=${(e: CustomEvent<number>) => {
          resolve(e.detail);
          renderTemplateResult(dialogContainerID, null);
        }}
      ></dialog-view>`;

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
