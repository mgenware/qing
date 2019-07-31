import { html, customElement, css, property, LitElement } from 'lit-element';

@customElement('spinner-view')
export class SpinnerView extends LitElement {
  static get styles() {
    return css`
      /* spinner */
      .spinner-screen-overlay {
        display: flex;
        position: fixed;
        z-index: 2000;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.9);
        justify-content: center;
        align-items: center;
      }

      .spinner {
        width: 40px;
        height: 40px;

        position: relative;
        margin: 10px auto;
      }

      .spinner-root {
        color: #868e96;
        font-size: 14px;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .double-bounce1,
      .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #004488;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: sk-bounce 2s infinite ease-in-out;
        animation: sk-bounce 2s infinite ease-in-out;
      }

      .double-bounce2 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
      }

      @-webkit-keyframes sk-bounce {
        0%,
        100% {
          -webkit-transform: scale(0);
        }
        50% {
          -webkit-transform: scale(1);
        }
      }

      @keyframes sk-bounce {
        0%,
        100% {
          transform: scale(0);
          -webkit-transform: scale(0);
        }
        50% {
          transform: scale(1);
          -webkit-transform: scale(1);
        }
      }
    `;
  }

  @property() text = '';
  @property() fullScreen = false;

  render() {
    const content = html`
      <div class="spinner-root">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        <div class="text-center"><slot></slot></div>
      </div>
    `;
    if (this.fullScreen) {
      return html`
        <div class="spinner-screen-overlay">${content}</div>
      `;
    }
    return content;
  }
}
