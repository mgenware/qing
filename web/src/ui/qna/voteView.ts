/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable class-methods-use-this */
import { BaseElement, customElement, html, css, when } from 'll';
import * as lp from 'lit-props';
import 'qing-button';
import { staticMainImage } from 'urls';
import 'ui/widgets/svgIcon';
import 'ui/content/hfNumber';
import ls from 'ls';
import { upVoteValue, downVoteValue } from 'sharedConstants';

const voteBtnSize = 20;

@customElement('vote-view')
export class VoteView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        .root {
          display: inline-flex;
        }
        .color-gray {
          color: var(--app-default-secondary-fore-color);
        }
        .color-down {
          color: var(--app-default-danger-fore-color);
        }
        .color-up {
          color: var(--app-default-success-fore-color);
        }
        .size-md {
          font-size: 1rem;
        }
        .size-lg {
          font-size: 1.5rem;
        }
        .value-column {
          margin-left: 0.8rem;
          margin-right: 0.8rem;
          min-width: 60px;
        }

        .bold {
          font-weight: bold;
        }

        qing-button.voted {
          border-left: 8px solid var(--app-default-primary-fore-color);
        }
      `,
    ];
  }

  @lp.number value = 0;
  @lp.number ups = 0;
  @lp.number downs = 0;
  @lp.number myVote = 0;

  render() {
    const { value, ups, downs } = this;
    let valueColorClass = 'color-gray';
    if (value > 0) {
      valueColorClass = 'color-up';
    } else if (value < 0) {
      valueColorClass = 'color-down';
    }
    return html`
      <div class="root">
        <div class="flex-auto d-flex flex-column">
          <qing-button
            title=${ls.upvote}
            class="flex-full"
            @click=${this.handleUpVoteClick}
            btnStyle=${this.myVote === upVoteValue ? 'primary' : ''}>
            <svg-icon
              iconStyle="success"
              .oneTimeSrc=${staticMainImage('plus-sign.svg')}
              .size=${voteBtnSize}></svg-icon>
          </qing-button>
          <qing-button
            title=${ls.downvote}
            class="flex-full"
            @click=${this.handleDownVoteClick}
            btnStyle=${this.myVote === downVoteValue ? 'primary' : ''}>
            <svg-icon
              iconStyle="danger"
              .oneTimeSrc=${staticMainImage('minus-sign.svg')}
              .size=${voteBtnSize}></svg-icon>
          </qing-button>
        </div>
        <div class="flex-full d-flex flex-column value-column">
          <div class="flex-full text-center flex-v-align">
            <span class=${`size-lg ${valueColorClass} bold`}
              ><hf-number .value=${value || 0}></hf-number
            ></span>
          </div>
          ${when(
            ups && downs,
            () => html` <div class="flex-full d-flex">
              ${when(
                ups,
                () => html`<div class="flex-full text-center flex-v-align">
                  <span class="color-up size-md"><hf-number .value=${ups}></hf-number></span>
                </div>`,
              )}
              ${when(
                downs,
                () => html`<div class="flex-full text-center flex-v-align">
                  <span class="color-down size-md"><hf-number .value=${-downs}></hf-number></span>
                </div>`,
              )}
            </div>`,
          )}
        </div>
      </div>
    `;
  }

  private handleUpVoteClick() {
    this.dispatchEvent(new CustomEvent('upVoteClick'));
  }

  private handleDownVoteClick() {
    this.dispatchEvent(new CustomEvent('downVoteClick'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vote-view': VoteView;
  }
}
