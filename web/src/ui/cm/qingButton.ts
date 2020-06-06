import { customElement } from 'lit-element';
import * as lp from 'lit-props';
import LitButton from 'lit-button';

export type QingButtonStyle = 'primary' | 'success' | 'danger' | 'warning' | '';

@customElement('qing-button')
export class QingButton extends LitButton {
  @lp.reflected.string btnStyle: QingButtonStyle = '';
}

declare global {
  interface HTMLElementTagNameMap {
    'qing-button': QingButton;
  }
}
