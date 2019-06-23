import bulmaStyle from './app/styles/bulma';
import { LitElement } from 'lit-element';

export default class Element extends LitElement {
  static get styles() {
    return [bulmaStyle];
  }
}
