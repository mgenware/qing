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

export abstract class StatefulPage extends BaseElement {
  static get styles() {
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

  async firstUpdated() {
    await this.reloadDataAsync();
  }

  abstract reloadDataAsync(): Promise<void>;
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

  render() {
    const { loadingStatus } = this;
    return html` ${loadingStatus.isSuccess ? this.renderContent() : this.renderProgress()} `;
  }

  private async handleLoadingRetry() {
    await this.reloadDataAsync();
  }
}
