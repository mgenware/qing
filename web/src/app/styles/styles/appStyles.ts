import { css } from 'lit-element';

export default css`
  /**********************************************************
  Common styles, available to all components and templates.

  NOTE: For theme-related styles, refer to \`themes.css\`.
  Please keep this file as small as possible by moving styles
  to components.
 **********************************************************/

  /* Responsive link ------------------------- */
  a {
    overflow-wrap: break-word;
    word-break: break-all;
    color: var(--app-default-primary-fore-color);
    text-decoration: none;
    cursor: hand;
  }
  a:hover {
    filter: brightness(120%);
  }
  a:active {
    filter: brightness(80%);
  }
  a:visited {
    filter: brightness(80%);
  }

  /* Link button, used in profile page ------------------------- */
  a.link-btn,
  a.link-btn:visited {
    color: var(--app-default-primary-fore-color);
    padding: 12px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
  }
  a.link-btn:hover,
  a.link-btn:active {
    opacity: 0.8;
  }

  /* Body ------------------------- */
  body {
    background-color: var(--app-default-back-color);
    color: var(--app-default-fore-color);
  }

  /* Responsive image ------------------------- */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Alignment helpers ------------------------- */
  .text-center {
    text-align: center;
  }
  .vertical-align-middle {
    vertical-align: middle;
  }

  /* Misc helpers ------------------------- */
  .content-disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  /* Flexbox helpers ------------------------- */
  .flex-full {
    flex: 1 1 auto;
    overflow: hidden;
  }
  .flex-auto {
    flex: 0 1 auto;
    overflow: hidden;
  }
  .flex-column {
    flex-direction: column;
  }
  .d-flex {
    display: flex;
  }
  .flex-column {
    flex-direction: column;
  }
  .flex-v-align {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Spacing helpers ------------------------- */
  .m-none {
    margin: 0;
  }
  .p-none {
    padding: 0;
  }
  .m-t-none {
    margin-top: 0;
  }
  .p-t-none {
    padding-top: 0;
  }
  .m-r-none {
    margin-right: 0;
  }
  .p-r-none {
    padding-right: 0;
  }
  .m-b-none {
    margin-bottom: 0;
  }
  .p-b-none {
    padding-bottom: 0;
  }
  .m-l-none {
    margin-left: 0;
  }
  .p-l-none {
    padding-left: 0;
  }
  .m-xxs {
    margin: 0.125rem;
  }
  .p-xxs {
    padding: 0.125rem;
  }
  .m-t-xxs {
    margin-top: 0.125rem;
  }
  .p-t-xxs {
    padding-top: 0.125rem;
  }
  .m-r-xxs {
    margin-right: 0.125rem;
  }
  .p-r-xxs {
    padding-right: 0.125rem;
  }
  .m-b-xxs {
    margin-bottom: 0.125rem;
  }
  .p-b-xxs {
    padding-bottom: 0.125rem;
  }
  .m-l-xxs {
    margin-left: 0.125rem;
  }
  .p-l-xxs {
    padding-left: 0.125rem;
  }
  .m-xs {
    margin: 0.25rem;
  }
  .p-xs {
    padding: 0.25rem;
  }
  .m-t-xs {
    margin-top: 0.25rem;
  }
  .p-t-xs {
    padding-top: 0.25rem;
  }
  .m-r-xs {
    margin-right: 0.25rem;
  }
  .p-r-xs {
    padding-right: 0.25rem;
  }
  .m-b-xs {
    margin-bottom: 0.25rem;
  }
  .p-b-xs {
    padding-bottom: 0.25rem;
  }
  .m-l-xs {
    margin-left: 0.25rem;
  }
  .p-l-xs {
    padding-left: 0.25rem;
  }
  .m-sm {
    margin: 0.5rem;
  }
  .p-sm {
    padding: 0.5rem;
  }
  .m-t-sm {
    margin-top: 0.5rem;
  }
  .p-t-sm {
    padding-top: 0.5rem;
  }
  .m-r-sm {
    margin-right: 0.5rem;
  }
  .p-r-sm {
    padding-right: 0.5rem;
  }
  .m-b-sm {
    margin-bottom: 0.5rem;
  }
  .p-b-sm {
    padding-bottom: 0.5rem;
  }
  .m-l-sm {
    margin-left: 0.5rem;
  }
  .p-l-sm {
    padding-left: 0.5rem;
  }
  .m-md {
    margin: 1rem;
  }
  .p-md {
    padding: 1rem;
  }
  .m-t-md {
    margin-top: 1rem;
  }
  .p-t-md {
    padding-top: 1rem;
  }
  .m-r-md {
    margin-right: 1rem;
  }
  .p-r-md {
    padding-right: 1rem;
  }
  .m-b-md {
    margin-bottom: 1rem;
  }
  .p-b-md {
    padding-bottom: 1rem;
  }
  .m-l-md {
    margin-left: 1rem;
  }
  .p-l-md {
    padding-left: 1rem;
  }
  .m-lg {
    margin: 2rem;
  }
  .p-lg {
    padding: 2rem;
  }
  .m-t-lg {
    margin-top: 2rem;
  }
  .p-t-lg {
    padding-top: 2rem;
  }
  .m-r-lg {
    margin-right: 2rem;
  }
  .p-r-lg {
    padding-right: 2rem;
  }
  .m-b-lg {
    margin-bottom: 2rem;
  }
  .p-b-lg {
    padding-bottom: 2rem;
  }
  .m-l-lg {
    margin-left: 2rem;
  }
  .p-l-lg {
    padding-left: 2rem;
  }
  .m-xl {
    margin: 4rem;
  }
  .p-xl {
    padding: 4rem;
  }
  .m-t-xl {
    margin-top: 4rem;
  }
  .p-t-xl {
    padding-top: 4rem;
  }
  .m-r-xl {
    margin-right: 4rem;
  }
  .p-r-xl {
    padding-right: 4rem;
  }
  .m-b-xl {
    margin-bottom: 4rem;
  }
  .p-b-xl {
    padding-bottom: 4rem;
  }
  .m-l-xl {
    margin-left: 4rem;
  }
  .p-l-xl {
    padding-left: 4rem;
  }
  .m-xxl {
    margin: 8rem;
  }
  .p-xxl {
    padding: 8rem;
  }
  .m-t-xxl {
    margin-top: 8rem;
  }
  .p-t-xxl {
    padding-top: 8rem;
  }
  .m-r-xxl {
    margin-right: 8rem;
  }
  .p-r-xxl {
    padding-right: 8rem;
  }
  .m-b-xxl {
    margin-bottom: 8rem;
  }
  .p-b-xxl {
    padding-bottom: 8rem;
  }
  .m-l-xxl {
    margin-left: 8rem;
  }
  .p-l-xxl {
    padding-left: 8rem;
  }

  /* Sticky footer used in main page ------------------------- */
  html {
    position: relative;
    min-height: 100%;
  }
  body {
    /* Margin bottom by footer height */
    margin-bottom: 100px;
  }

  #main-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    /* Set the fixed height of the footer here */
    height: 100px;
    font-size: 15px;
    text-align: center;
    padding: 10px 0 0 0;
    background-color: var(--app-footer-back-color);
    color: var(--app-footer-fore-color);
    border-top: 1px solid var(--app-footer-fore-color);
  }

  #main-footer a {
    color: var(--app-footer-fore-color);
  }

  /* Avatar helpers ------------------------- */
  .avatar-s {
    border-radius: 2px;
  }
  .avatar-m {
    border-radius: 4px;
  }
  .avatar-l {
    border-radius: 6px;
  }

  /* Form helpers ------------------------- */
  label.app-form-label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }

  input.app-inline-text-input {
    background-color: transparent;
    color: var(--app-default-fore-color);
    border: 1px solid var(--app-default-separator-color);
  }

  input.app-inline-text-input:invalid {
    border-color: var(--app-danger-fore-color);
  }

  /* Table ------------------------- */
  .app-table-container {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  .app-table {
    border-collapse: collapse;
    width: 100%;
  }

  .app-table th,
  .app-table td {
    text-align: left;
    padding: 0.5rem;
  }

  .app-table tbody tr:hover {
    background-color: var(--app-highlight-color);
  }

  .app-table thead {
    border-bottom: 1px solid var(--app-default-separator-color);
  }

  .app-table th {
    white-space: nowrap;
  }
`;
