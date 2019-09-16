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

  firstUpdated() {
    const activeElement = this.getShadowElement('active-element');
    if (activeElement) {
      // Set focus to active element
      setTimeout(() => activeElement.focus(), 100);
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
            <h2>${this.renderIcon()}${this.modalTitle}</h2>
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
            id="active-element"
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
      ${unsafeHTML(
        `<span class="m-r-sm vertical-align-middle">${icon.svg}</span>`,
      )}
    `;
  }

  private closeModal() {
    this.dispatchEvent(new CustomEvent<string>('modalClosed'));
  }
}

export class ModalIcon {
  public svg: string;
  constructor(public cls: string, public size: number, svg: string) {
    // Reprocess svg inplace
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const element = doc.documentElement;
    element.setAttribute('class', cls);
    element.setAttribute('width', size.toString());
    element.setAttribute('height', size.toString());
    this.svg = element.outerHTML;
  }
}

function iconTypeToIcon(type: ModalIconType): ModalIcon | null {
  // + Sign makes switch-case work with TS enum type
  switch (+type) {
    case ModalIconType.error:
      return new ModalIcon(
        'is-danger',
        ICON_SIZE,
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
      );
  }
  return null;
}
