import { css } from 'lit-element';

export default css`
  /*! modern-normalize v0.5.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

  /* Document
   ========================================================================== */

  /**
 * Use a better box model (opinionated).
 */

  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  /**
 * Use a more readable tab size (opinionated).
 */

  :root {
    -moz-tab-size: 4;
    tab-size: 4;
  }

  /**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

  html {
    line-height: 1.15; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }

  /* Sections
   ========================================================================== */

  /**
 * Remove the margin in all browsers.
 */

  body {
    margin: 0;
  }

  /**
 * Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
 */

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
  }

  /* Grouping content
   ========================================================================== */

  /**
 * Add the correct height in Firefox.
 */

  hr {
    height: 0;
  }

  /* Text-level semantics
   ========================================================================== */

  /**
 * Add the correct text decoration in Chrome, Edge, and Safari.
 */

  abbr[title] {
    text-decoration: underline dotted;
  }

  /**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

  b,
  strong {
    font-weight: bolder;
  }

  /**
 * 1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
 * 2. Correct the odd 'em' font sizing in all browsers.
 */

  code,
  kbd,
  samp,
  pre {
    font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier,
      monospace; /* 1 */
    font-size: 1em; /* 2 */
  }

  /**
 * Add the correct font size in all browsers.
 */

  small {
    font-size: 80%;
  }

  /**
 * Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
 */

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  /* Forms
   ========================================================================== */

  /**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit; /* 1 */
    font-size: 100%; /* 1 */
    line-height: 1.15; /* 1 */
    margin: 0; /* 2 */
  }

  /**
 * Remove the inheritance of text transform in Edge and Firefox.
 * 1. Remove the inheritance of text transform in Firefox.
 */

  button,
  select {
    /* 1 */
    text-transform: none;
  }

  /**
 * Correct the inability to style clickable types in iOS and Safari.
 */

  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button;
  }

  /**
 * Remove the inner border and padding in Firefox.
 */

  button::-moz-focus-inner,
  [type='button']::-moz-focus-inner,
  [type='reset']::-moz-focus-inner,
  [type='submit']::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  /**
 * Restore the focus styles unset by the previous rule.
 */

  button:-moz-focusring,
  [type='button']:-moz-focusring,
  [type='reset']:-moz-focusring,
  [type='submit']:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  /**
 * Correct the padding in Firefox.
 */

  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }

  /**
 * Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
 */

  legend {
    padding: 0;
  }

  /**
 * Add the correct vertical alignment in Chrome and Firefox.
 */

  progress {
    vertical-align: baseline;
  }

  /**
 * Correct the cursor style of increment and decrement buttons in Safari.
 */

  [type='number']::-webkit-inner-spin-button,
  [type='number']::-webkit-outer-spin-button {
    height: auto;
  }

  /**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

  [type='search'] {
    -webkit-appearance: textfield; /* 1 */
    outline-offset: -2px; /* 2 */
  }

  /**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

  [type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  /**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to 'inherit' in Safari.
 */

  ::-webkit-file-upload-button {
    -webkit-appearance: button; /* 1 */
    font: inherit; /* 2 */
  }

  /* Interactive
   ========================================================================== */

  /*
 * Add the correct display in Chrome and Safari.
 */

  summary {
    display: list-item;
  }

  /* responsive link */
  a {
    overflow-wrap: break-word;
    word-break: break-all;
  }

  img {
    object-fit: scale-down;
  }

  .md-content p {
    font-size: 1.2rem;
    line-height: 2.2rem;
  }

  .md-content ul,
  .md-content ol {
    font-size: 1.2rem;
    line-height: 2rem;
  }

  .md-content a {
    padding-right: 10px;
  }

  .text-center {
    text-align: center;
  }

  .link-white a {
    color: #fff;
  }
  .link-white a:hover {
    color: #fff;
  }
  .link-white a:active {
    color: #fff;
  }
  .link-white a:visited {
    color: #fff;
  }
  .link-black a {
    color: #000;
  }
  .link-black a:hover {
    color: #000;
  }
  .link-black a:active {
    color: #000;
  }
  .link-black a:visited {
    color: #000;
  }
  .link-nounderline a {
    text-decoration: none;
  }
  .link-nounderline a:hover {
    text-decoration: none;
  }
  .link-nounderline a:active {
    text-decoration: none;
  }
  .link-nounderline a:visited {
    text-decoration: none;
  }
  .link-gray a {
    color: gray;
  }
  .link-gray a:hover {
    color: gray;
  }
  .link-gray a:active {
    color: gray;
  }
  .link-gray a:visited {
    color: gray;
  }

  .white-space-nowrap {
    white-space: nowrap;
  }

  .display-block {
    display: block;
  }
  .display-inline-block {
    display: inline-block;
  }

  .border-radius-25 {
    border-radius: 25px;
  }
  .border-radius-10 {
    border-radius: 10px;
  }
  .border-radius-5 {
    border-radius: 5px;
  }
  .vertical-align-middle {
    vertical-align: middle;
  }
  .vertical-align-baseline {
    vertical-align: baseline;
  }
  .bg-clear {
    background-color: transparent;
  }

  .content-disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  .cursor-hand {
    cursor: pointer;
  }

  .m-flex-full {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
  }
  .d-flex {
    display: flex;
  }
  .flex-column {
    flex-direction: column;
  }

  .m-disable-scroll {
    overflow: hidden;
  }

  .hidden {
    visibility: hidden;
  }

  .color-gray {
    color: gray;
  }

  .color-lightgray {
    color: lightgray;
  }

  .color-pink {
    color: pink;
  }

  .text-muted {
    color: #8b96a0 !important;
  }

  .main-tag {
    color: #6d6d6d;
    padding: 1px 5px;
    white-space: nowrap;
    padding-right: 0;
  }

  blockquote {
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    quotes: '\201C''\201D''\2018''\2019';
  }
  blockquote:before {
    color: #ccc;
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
  blockquote p {
    display: inline;
  }

  .code-font {
    font-family: 'source-code-pro', Menlo, Consolas, Monaco, 'Andale Mono',
      'Courier New', monospace;
  }

  /* Common spacing styles ------------------------- */
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

  /* Sticky footer styles
  -------------------------------------------------- */
  html {
    position: relative;
    min-height: 100%;
  }
  body {
    /* Margin bottom by footer height */
    margin-bottom: 100px;
  }
  .cf-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    /* Set the fixed height of the footer here */
    height: 100px;
    font-size: 15px;
    color: #c9c9c9;
    text-align: center;
    padding: 10px 0 0 0;
  }

  /** http://www.rgagnon.com/jsdetails/js-nice-effect-the-KBD-tag.html */
  kbd {
    margin: 0px 0.1em;
    padding: 0.1em 0.6em;
    border-radius: 3px;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(51, 51, 51);
    line-height: 1.4;
    font-family: Arial, Helvetica, sans-serif;
    display: inline-block;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 2px #ffffff;
  }
`;
