import { css } from 'lit-element';

export default css`
  .kx-editor {
    background: white;
    padding: 0.5rem;
  }

  .kx-editor .ProseMirror {
    padding: 0.8rem 0.5rem;
    height: 250px;
    overflow-y: scroll;
  }

  .kx-editor .ProseMirror:focus {
    outline: none;
  }

  .ProseMirror-selectednode {
    outline: 1px dashed rgb(185, 185, 185);
  }

  .kx-toolbar {
    display: flex;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid #ddd;
    margin-bottom: 0.2rem;
  }

  .kx-toolbar button {
    display: inline-flex;
    padding: 0.2rem;
    margin: 0 1px;
    border-radius: 0.15em;
    text-decoration: none;
    text-align: center;
    vertical-align: top;
    align-items: center;
    cursor: pointer;
    border-color: transparent;
    filter: brightness(100%);
    transition: all 0.3s ease;
  }

  .kx-toolbar button:hover:not(.is-disabled) {
    filter: brightness(80%);
  }

  .kx-toolbar button.is-disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .kx-toolbar button.is-active {
    filter: brightness(80%);
  }

  /* For textual buttons */
  .kx-toolbar span {
    font-size: 15px;
    font-weight: bold;
  }

  .kx-toolbar .separator {
    border-right: 1px solid #ddd;
    margin-left: 2px;
    margin-right: 2px;
  }
`;
