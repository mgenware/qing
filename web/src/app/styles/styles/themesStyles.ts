import { css } from 'lit-element';

export default css`
  /**********************************************************
  Core colors
 **********************************************************/

  /* Default theme (light) ------------------------- */
  :root {
    --app-default-back-color: white;
    --app-default-secondary-back-color: #e4e4e4;
    --app-default-fore-color: black;
    --app-default-secondary-fore-color: #676f75;
    --app-default-primary-fore-color: #00386a;
    --app-default-danger-fore-color: #d11e30;
    --app-default-success-fore-color: #43ac6a;
    --app-default-warning-fore-color: #fecd21;

    --app-default-separator-color: #dadada;

    --app-primary-back-color: var(--app-default-primary-fore-color);
    --app-primary-fore-color: white;
    --app-danger-back-color: var(--app-default-danger-fore-color);
    --app-danger-fore-color: white;
    --app-success-back-color: var(--app-default-success-fore-color);
    --app-success-fore-color: white;
    --app-info-back-color: #e7e7e7;
    --app-info-fore-color: #343a40;
    --app-warning-back-color: var(--app-default-warning-fore-color);
    --app-warning-fore-color: black;

    --app-footer-back-color: #494949;
    --app-footer-fore-color: #9c9c9c;

    --app-keyboard-focus-color: #8dc3eb;
    --app-navbar-back-color: #343a40;
    --app-navbar-fore-color: #cfcfcf;
    --app-navbar-divider-color: #4b4b4b;
    --app-navbar-border-bottom: 0;

    --app-highlight-color: rgba(0, 0, 0, 0.11);

    --app-surface-radius-md: 6px;
    /* Radius for smaller components like inputs. */
    --app-surface-radius-sm: 4px;

    --app-heading-indicator-width-md: 6px;
    --app-heading-indicator-width-sm: 3px;
  }

  /* Dark theme ------------------------- */
  .theme-dark {
    --app-default-back-color: black;
    --app-default-secondary-back-color: #2a2a2a;
    --app-default-fore-color: #777777;
    --app-default-secondary-fore-color: #5a5a5a;
    --app-default-primary-fore-color: #00213d;
    --app-default-danger-fore-color: #8a1212;
    --app-default-success-fore-color: #205333;
    --app-default-warning-fore-color: #68540e;

    --app-default-separator-color: #272727;

    /** Used internally in dark mode. Slightly lighter than \`--app-default-fore-color\` */
    --private-app-dark-context-fore-color: #979797;
    --app-primary-back-color: var(--app-default-primary-fore-color);
    --app-primary-fore-color: var(--private-app-dark-context-fore-color);
    --app-danger-back-color: var(--app-default-danger-fore-color);
    --app-danger-fore-color: var(--private-app-dark-context-fore-color);
    --app-success-back-color: var(--app-default-success-fore-color);
    --app-success-fore-color: var(--private-app-dark-context-fore-color);
    --app-info-back-color: #272727;
    --app-info-fore-color: var(--private-app-dark-context-fore-color);
    --app-warning-back-color: var(--app-default-warning-fore-color);
    --app-warning-fore-color: var(--private-app-dark-context-fore-color);

    --app-footer-back-color: #000000;
    --app-footer-fore-color: #3d3d3d;

    --app-keyboard-focus-color: #51708a;

    --app-navbar-back-color: #000000;
    --app-navbar-fore-color: #707070;
    --app-navbar-divider-color: #353535;
    --app-navbar-border-bottom: 1px solid var(--app-navbar-divider-color);

    --app-highlight-color: rgba(255, 255, 255, 0.11);
  }

  /**********************************************************
  Component theme support
 **********************************************************/

  /* Common styles ------------------------- */
  .is-secondary {
    color: var(--app-default-secondary-fore-color) !important;
  }

  /* HTML components ------------------------- */
  blockquote {
    background: var(--app-default-secondary-back-color);
    border-left: 10px solid var(--app-default-secondary-fore-color);
    margin: 1.5rem 10px;
    padding: 0.5rem 10px;
  }

  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid var(--app-default-separator-color);
    margin: 0.8rem 0;
    padding: 0;
  }

  /* qing-button ------------------------- */
  qing-button.small::part(button) {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.75rem;
  }
  qing-button.large::part(button) {
    font-size: 1.25rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }

  qing-button::part(button) {
    background-color: var(--app-info-back-color);
    color: var(--app-info-fore-color);
    --button-outline-color: var(--app-keyboard-focus-color);
  }
  qing-button[btnStyle='success']::part(button) {
    background-color: var(--app-success-back-color);
    color: var(--app-success-fore-color);
  }
  qing-button[btnStyle='danger']::part(button) {
    background-color: var(--app-danger-back-color);
    color: var(--app-danger-fore-color);
  }
  qing-button[btnStyle='primary']::part(button) {
    background-color: var(--app-primary-back-color);
    color: var(--app-primary-fore-color);
  }
  qing-button[btnStyle='warning']::part(button) {
    background-color: var(--app-warning-back-color);
    color: var(--app-warning-fore-color);
  }

  /* qing-dialog ------------------------- */
  qing-dialog::part(overlay) {
    background-color: var(--app-default-back-color);
    color: var(--app-default-fore-color);
    border-radius: var(--app-surface-radius-md);
    border: 1px solid var(--app-default-separator-color);
  }
  qing-dialog::part(footer-button) {
    background-color: var(--app-info-back-color);
    color: var(--app-info-fore-color);
    --button-outline-color: var(--app-keyboard-focus-color);
  }
  qing-dialog .icon-success {
    fill: var(--app-default-success-fore-color);
  }
  qing-dialog .icon-warning {
    fill: var(--app-default-warning-fore-color);
  }
  qing-dialog .icon-error {
    fill: var(--app-default-danger-fore-color);
  }

  /* alert-view ------------------------- */
  alert-view[alertStyle='success'] {
    --alert-border-color: var(--app-default-success-fore-color);
  }
  alert-view[alertStyle='danger'] {
    --alert-border-color: var(--app-default-danger-fore-color);
  }
  alert-view[alertStyle='primary'] {
    --alert-border-color: var(--app-default-primary-fore-color);
  }
  alert-view[alertStyle='warning'] {
    --alert-border-color: var(--app-default-warning-fore-color);
  }

  /* tag-view ------------------------- */
  tag-view {
    --background-color: var(--app-info-back-color);
    --color: var(--app-info-fore-color);
  }
  tag-view[tagStyle='success'] {
    --background-color: var(--app-success-back-color);
    --color: var(--app-success-fore-color);
  }
  tag-view[tagStyle='danger'] {
    --background-color: var(--app-danger-back-color);
    --color: var(--app-danger-fore-color);
  }
  tag-view[tagStyle='primary'] {
    --background-color: var(--app-primary-back-color);
    --color: var(--app-primary-fore-color);
  }
  tag-view[tagStyle='warning'] {
    --background-color: var(--app-warning-back-color);
    --color: var(--app-warning-fore-color);
  }

  /* section-view ------------------------- */
  section-view {
    --content-color: var(--app-default-fore-color);
    --border-radius: var(--app-surface-radius-md);
  }
  section-view[sectionStyle='success'] {
    --header-color: var(--app-success-fore-color);
    --tint-color: var(--app-success-back-color);
  }
  section-view[sectionStyle='danger'] {
    --header-color: var(--app-danger-fore-color);
    --tint-color: var(--app-danger-back-color);
  }
  section-view[sectionStyle='primary'] {
    --header-color: var(--app-primary-fore-color);
    --tint-color: var(--app-primary-back-color);
  }
  section-view[sectionStyle='warning'] {
    --header-color: var(--app-warning-fore-color);
    --tint-color: var(--app-warning-back-color);
  }
  section-view[sectionStyle='info'] {
    --header-color: var(--app-info-fore-color);
    --tint-color: var(--app-info-back-color);
  }

  /* svg-icon ------------------------- */
  svg-icon {
    --svg-fill: var(--app-default-back-color);
  }
  svg-icon[iconStyle='success'] {
    --svg-fill: var(--app-success-back-color);
  }
  svg-icon[iconStyle='danger'] {
    --svg-fill: var(--app-danger-back-color);
  }
  svg-icon[iconStyle='primary'] {
    --svg-fill: var(--app-primary-back-color);
  }
  svg-icon[iconStyle='warning'] {
    --svg-fill: var(--app-warning-back-color);
  }
  svg-icon[iconStyle='info'] {
    --svg-fill: var(--app-info-back-color);
  }
`;