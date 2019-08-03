import { LitElement } from 'lit-element';
import mainStyles from './app/styles/main';

export default class BaseElement extends LitElement {
  static get styles() {
    return mainStyles;
  }
}
