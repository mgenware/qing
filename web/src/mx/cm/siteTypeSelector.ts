/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';
import { BaseElement, customElement, html, css, property } from 'll';
import ls from 'ls';

interface OptionData {
  value: appdef.SiteType;
  text: string;
  desc: string;
}

const options: OptionData[] = [
  { value: appdef.SiteType.blog, text: ls.siteTypeBlog, desc: ls.siteTypeBlogDesc },
  { value: appdef.SiteType.community, text: ls.siteTypeCommunity, desc: ls.siteTypeCommunityDesc },
  { value: appdef.SiteType.forums, text: ls.siteTypeForums, desc: ls.siteTypeForumsDesc },
];

@customElement('site-type-selector')
export class SiteTypeSelector extends BaseElement {
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

  @property({ type: Number }) siteType: appdef.SiteType = 0;

  override render() {
    return html` <div class="root">${options.map((opt) => this.renderItem(opt))}</div> `;
  }

  private renderItem(opt: OptionData) {
    return html`
      <div class=${`opt ${opt.value === this.siteType ? 'active' : ''}`}>
        <h2>${opt.text}</h2>
        <p>${opt.desc}</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-type-selector': SiteTypeSelector;
  }
}
