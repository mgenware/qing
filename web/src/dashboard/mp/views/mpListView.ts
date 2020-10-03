import { html, TemplateResult } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';
import './mpPageControl';
import PaginatedList from 'lib/api/paginatedList';

const defaultPageSize = 10;

export abstract class MPListView<T> extends BaseElement {
  @lp.object loadingStatus = LoadingStatus.working;
  @lp.array items: T[] = [];

  render() {
    return html`
      <status-overlay .status=${this.loadingStatus} canRetry>
        <div class="section is-info">${this.sectionTitle()}</div>
        <table>
          ${this.renderTable()}
        </table>
        <hr />
        <mp-page-control></mp-page-control>
      </status-overlay>
    `;
  }

  firstUpdated() {
    this.startLoading(1, defaultPageSize);
  }

  abstract sectionTitle(): string;
  abstract renderTable(): TemplateResult | null;
  abstract async startLoading(page: number, pageSize: number): Promise<PaginatedList<T> | null>;
}
