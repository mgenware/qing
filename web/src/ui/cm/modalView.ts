import {
  html,
  customElement,
  property,
  css,
  TemplateResult,
} from 'lit-element';
import BaseElement from 'baseElement';
import ls from 'ls';
import { styleMap } from 'lit-html/directives/style-map';

export enum DialogButtonsType {
  none,
  ok,
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
          -webkit-animation-name: animatetop;
          -webkit-animation-duration: 0.4s;
          animation-name: animatetop;
          animation-duration: 0.4s;
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

        /* The Close Button */
        .close {
          color: white;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }

        .close:hover,
        .close:focus {
          color: #000;
          text-decoration: none;
          cursor: pointer;
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
  @property() showCloseButton = true;
  @property() modalTitle = '';
  @property() buttons = DialogButtonsType.none;
  @property() isOpen = false;

  render() {
    return html`
      <div
        class="modal"
        style=${styleMap({ display: this.isOpen ? 'block' : 'none' })}
      >
        <div class="modal-content">
          <div class="modal-header">
            ${this.showCloseButton
              ? html`
                  <span class="close">&times;</span>
                `
              : ''}
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
      case DialogButtonsType.ok: {
        footerContent = html`
          <lit-button @click=${this.closeModal}>${ls.ok}</lit-button>
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

  private closeModal() {
    this.dispatchEvent(new CustomEvent<string>('modalClosed'));
  }
}
