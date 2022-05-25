/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, html, css, TemplateResult } from 'll';
import * as lp from 'lit-props';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/status/statusView';

// Base class for displaying a loading status with a status-view. If the status
// is success, it renders the result of `renderContent`.
// Use status-overlay if you would like to display a status-view on top of the
// content view.
export abstract class StatefulPage extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.object loadingStatus = LoadingStatus.notStarted;

  override async firstUpdated() {
    await this.reloadStatefulPageDataAsync();
  }

  abstract reloadStatefulPageDataAsync(): Promise<void>;
  abstract renderContent(): TemplateResult;
  renderProgress() {
    const { loadingStatus } = this;
    return html`
      <status-view
        .progressViewPadding=${'md'}
        .status=${loadingStatus}
        .canRetry=${true}
        @onRetry=${this.handleLoadingRetry}></status-view>
    `;
  }

  override render() {
    const { loadingStatus } = this;
    return html` ${loadingStatus.isSuccess ? this.renderContent() : this.renderProgress()} `;
  }

  private async handleLoadingRetry() {
    await this.reloadStatefulPageDataAsync();
  }
}
