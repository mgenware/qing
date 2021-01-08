/* eslint-disable class-methods-use-this */
import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'qing-button';
import { staticMainImage } from 'urls';
import 'ui/widgets/svgIcon';
import ls from 'ls';
import { tif } from 'lib/htmlLib';

const voteBtnSize = 20;

@customElement('poll-view')
export class PollView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .root {
          display: flex;
        }
      `,
    ];
  }

  @lp.number value = 0;
  @lp.number ups = 0;
  @lp.number downs = 0;

  render() {
    return html`
      <div class="root">
        <div class="flex-auto d-flex flex-column">
          <qing-button title=${ls.upvote} class="flex-full">
            <svg-icon
              iconStyle="success"
              .src=${staticMainImage('plus-sign.svg')}
              .size=${voteBtnSize}
            ></svg-icon>
          </qing-button>
          <qing-button title=${ls.downvote} class="flex-full">
            <svg-icon
              iconStyle="danger"
              .src=${staticMainImage('minus-sign.svg')}
              .size=${voteBtnSize}
            ></svg-icon>
          </qing-button>
        </div>
        <div class="flex-full d-flex flex-column">
          <div class="flex-full text-center vertical-align-middle">${this.value || 0}</div>
          ${tif(
            this.ups || this.downs,
            html` <div class="flex-full d-flex">
              ${tif(
                this.ups,
                html`<div class="flex-full text-center vertical-align-middle">${this.ups}</div>`,
              )}
              ${tif(
                this.downs,
                html`<div class="flex-full text-center vertical-align-middle">${this.downs}</div>`,
              )}
            </div>`,
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'poll-view': PollView;
  }
}
