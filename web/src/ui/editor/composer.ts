import './editor-view';
import { html, customElement, property } from 'lit-element';
import ls from '../../ls';
import app from '../../app';
import Element from '../../element';
import Editor from 'kangxi-editor';
import styles from '../../app/styles/kangxi';
import langEn from 'kangxi-editor/dist/langs/en';
import langCs from 'kangxi-editor/dist/langs/cs';

export interface ComposerOptions {
  showTitle?: boolean;
}

@customElement('composer')
export class Composer extends Element {
  @property() opts: ComposerOptions = {};
  @property() title = '';

  render() {
    const { opts } = this;
    const titleElement = opts.showTitle
      ? html`
          <input type="text" @change=${e => (this.title = e.target.value)} />
        `
      : '';
  }
}
