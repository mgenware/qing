import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import { format, ls } from 'ls';
import 'ui/cm/statusView';
import LoadingStatus from 'lib/loadingStatus';

@customElement('cmt-footer-view')
export class CmtFooterView extends BaseElement {
  @lp.object status = LoadingStatus.empty;
  @lp.bool hasNext = false;
  @lp.bool replies = false;

  render() {
    const { status } = this;
    if (status.isSuccess) {
      if (this.hasNext) {
        return html`
          <p>
            <a href="#" @click=${this.handleMoreButtonClick}
              >${format(
                'pViewMore',
                this.replies ? ls.replies : ls.comments,
              )}</a
            >
          </p>
        `;
      }
      // If success and `hasNext` is false, nothing to show.
      return html``;
    } else {
      return html`
        <status-view
          .status=${status}
          .canRetry=${true}
          @onRetry=${this.handleMoreButtonClick}
        ></status-view>
      `;
    }
  }

  private handleMoreButtonClick() {
    this.dispatchEvent(new CustomEvent<undefined>('viewMoreClick'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-footer-view': CmtFooterView;
  }
}
