import {
  html,
  customElement,
  property,
  css,
  TemplateResult,
} from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import BaseElement from 'baseElement';
import ls from 'ls';
import { styleMap } from 'lit-html/directives/style-map';
const ICON_SIZE = 50;
const ACTIVE_ELEMENT_ID = 'active-element';

export enum ModalButton {
  ok = 1,
  yes,
  no,
  cancel,
}

const ModalButtonLS = new Map<ModalButton, string>();
ModalButtonLS.set(ModalButton.ok, ls.ok);
ModalButtonLS.set(ModalButton.yes, ls.yes);
ModalButtonLS.set(ModalButton.no, ls.no);
ModalButtonLS.set(ModalButton.cancel, ls.cancel);

const ModalPrimaryButton = new Set<ModalButton>();
ModalPrimaryButton.add(ModalButton.ok);

export enum ModalIcon {
  error = 1,
  success,
  warning,
}

export interface ModalClickInfo {
  type: number;
  index: number;
}

@customElement('modal-view')
export class ModalView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      // https://www.w3schools.com/howto/howto_css_modals.asp
      css`
        /* The Modal (background) */
        .modal {
          display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 1; /* Sit on top */
          padding-top: 100px; /* Location of the box */
          left: 0;
          top: 0;
          width: 100%; /* Full width */
          height: 100%; /* Full height */
          overflow: auto; /* Enable scroll if needed */
          background-color: rgb(0, 0, 0); /* Fallback color */
          background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
        }

        .modal-content {
          position: relative;
          background-color: var(--main-back-color);
          margin: auto;
          padding: 0;
          border: 1px solid var(--main-weak-tint-color);
          width: 100%;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
          animation-name: animatetop;
          animation-duration: 0.2s;
        }

        @media (min-width: 768px) {
          .modal-content {
            width: 80%;
          }
        }

        /* Add Animation */
        @-webkit-keyframes animatetop {
          from {
            top: -300px;
            opacity: 0;
          }
          to {
            top: 0;
            opacity: 1;
          }
        }

        @keyframes animatetop {
          from {
            top: -300px;
            opacity: 0;
          }
          to {
            top: 0;
            opacity: 1;
          }
        }

        .modal-header {
          padding: 2px 16px;
        }

        .modal-body {
          padding: 2px 16px;
        }

        .modal-footer {
          padding: 2px 16px;
          text-align: center;
        }
      `,
    ];
  }
  @property() modalTitle = '';
  @property({ type: Array }) buttons: ModalButton[] = [];
  @property({ type: Boolean }) isOpen = false;
  @property({ type: Number }) icon: ModalIcon | null = null;
  @property({ type: Number }) timeout = 0;
  @property({ type: Number }) activeButtonIndex = -1;

  firstUpdated() {
    const activeElement = this.getShadowElement(ACTIVE_ELEMENT_ID);
    if (activeElement) {
      // Set focus to active element
      setTimeout(() => activeElement.focus(), 100);
    }
    if (this.timeout) {
      setTimeout(() => this.closeModal(0, 0), this.timeout);
    }
  }

  render() {
    return html`
      <div
        class="modal"
        style=${styleMap({ display: this.isOpen ? 'block' : 'none' })}
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2>${this.renderIcon()}<span>${this.modalTitle}</span></h2>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          ${this.renderButtons()}
        </div>
      </div>
    `;
  }

  private renderButtons(): TemplateResult {
    const { buttons } = this;
    if (!buttons || !buttons.length) {
      return html``;
    }
    return html`
      <div class="modal-footer">
        ${buttons.map((btnType, index) => {
          return html`
            <lit-button
              id=${index === this.activeButtonIndex ? ACTIVE_ELEMENT_ID : ''}
              class=${ModalPrimaryButton.has(btnType) ? 'is-primary' : ''}
              @click=${() => this.closeModal(btnType, index)}
              >${ModalButtonLS.get(btnType)}</lit-button
            >
          `;
        })}
      </div>
    `;
  }

  private renderIcon(): TemplateResult {
    if (!this.icon) {
      return html``;
    }
    const icon = iconTypeToIcon(this.icon);
    if (!icon) {
      return html``;
    }
    return html`
      ${unsafeHTML(`<span class="m-r-sm">${icon.svg}</span>`)}
    `;
  }

  private closeModal(type: number, index: number) {
    this.dispatchEvent(
      new CustomEvent<ModalClickInfo>('modalClosed', {
        detail: {
          type,
          index,
        },
      }),
    );
  }
}

class ModalIconData {
  public svg: string;
  constructor(public cls: string, public size: number, svg: string) {
    // Reprocess svg in place
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const element = doc.documentElement;
    element.setAttribute('class', `${cls} vertical-align-middle`);
    element.setAttribute('width', size.toString());
    element.setAttribute('height', size.toString());
    this.svg = element.outerHTML;
  }
}

function iconTypeToIcon(type: ModalIcon): ModalIconData | null {
  // + Sign makes switch-case work with TS enum type
  switch (+type) {
    case ModalIcon.error:
      return new ModalIconData(
        'is-danger',
        ICON_SIZE,
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
      );

    case ModalIcon.success:
      return new ModalIconData(
        'is-success',
        ICON_SIZE,
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`,
      );

    case ModalIcon.warning:
      return new ModalIconData(
        'is-warning',
        ICON_SIZE,
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
      );
  }
  return null;
}
