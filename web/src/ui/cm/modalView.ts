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

export enum ModalButtonType {
  none,
  ok,
}

export enum ModalIconType {
  none,
  error,
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

        /* Modal Content */
        .modal-content {
          position: relative;
          background-color: #fefefe;
          margin: auto;
          padding: 0;
          border: 1px solid #888;
          width: 80%;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
          animation-name: animatetop;
          animation-duration: 0.2s;
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
  @property() buttons = ModalButtonType.none;
  @property() isOpen = false;
  @property() icon = ModalIconType.none;

  render() {
    return html`
      <div
        class="modal"
        style=${styleMap({ display: this.isOpen ? 'block' : 'none' })}
      >
        <div class="modal-content">
          <div class="modal-header">
            ${this.renderIcon()}
            <h2>${this.modalTitle}</h2>
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
    let footerContent: TemplateResult | null = null;
    // The + sign makes sure switch-case work with TS enums
    switch (+this.buttons) {
      case ModalButtonType.ok: {
        footerContent = html`
          <lit-button
            autofocus="true"
            class="is-primary"
            @click=${this.closeModal}
            >${ls.ok}</lit-button
          >
        `;
        break;
      }
    }
    if (footerContent) {
      return html`
        <div class="modal-footer">
          ${footerContent}
        </div>
      `;
    }
    return html``;
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
      ${unsafeHTML(`<span class="${icon.cls}">${icon.svg}</span>`)}
    `;
  }

  private closeModal() {
    this.dispatchEvent(new CustomEvent<string>('modalClosed'));
  }
}

export class ModalIcon {
  constructor(public cls: string, public svg: string) {}
}

function iconTypeToIcon(type: ModalIconType): ModalIcon | null {
  // + Sign makes switch-case work with TS enum type
  switch (+type) {
    case ModalIconType.error:
      return new ModalIcon(
        'is-danger',
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/></svg>`,
      );
  }
  return null;
}
