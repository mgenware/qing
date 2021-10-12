/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, ref, Ref, createRef } from 'll';
import * as lp from 'lit-props';
import { formatLS, ls } from 'ls';
import { renderTemplateResult } from 'lib/htmlLib';
import { EditBarApp } from 'ui/editor/editBarApp';
// NOTE: `edit-bar-app` is required as it's being used by post page template.
import 'ui/editor/editBarApp';
import DeleteEntityLoader from 'com/postCore/loaders/deleteEntityLoader';
import 'com/postCore/setEntityApp';
import SetEntityApp from 'com/postCore/setEntityApp';
import appPageState from 'app/appPageState';
import appAlert from 'app/appAlert';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';
import { CHECK } from 'checks';

import {
  entityAnswer,
  entityCmt,
  entityDiscussion,
  entityPost,
  entityQuestion,
} from 'sharedConstants';

let editPostApp: SetEntityApp | null = null;

export function entityTypeToLS(entityType: number): string {
  switch (entityType) {
    case entityPost:
      return ls.post;
    case entityQuestion:
      return ls.question;
    case entityAnswer:
      return ls.answer;
    case entityCmt:
      return ls.comment;
    case entityDiscussion:
      return ls.discussion;
    default: {
      CHECK(false);
      return '';
    }
  }
}

@customElement('post-user-app')
export class PostUserApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.string createdAt = '';
  @lp.string modifiedAt = '';
  @lp.string uid = '';
  @lp.string eid = '';
  @lp.number entityType = 0;

  // Optional properties (can be overridden by named slots).
  @lp.string userIconURL = '';
  @lp.string userURL = '';
  @lp.string userStatus = '';
  @lp.string userName = '';

  private editBarAppEl: Ref<EditBarApp> = createRef();

  render() {
    const imgSlot =
      this.userURL && this.userIconURL
        ? html`<a href="{{html .UserURL}}" slot="img">
            <img
              src=${this.userIconURL}
              alt=${this.userName}
              class="avatar-m"
              width="50"
              height="50" />
          </a>`
        : html`<slot name="img"></slot>`;
    const nameSlot = this.userName
      ? html`<a href="{{html .UserURL}}" slot="name">${this.userName}</a>`
      : html`<slot name="name"></slot>`;
    const statusSlot = this.userStatus
      ? html`<span slot="status">${this.userStatus}</span>`
      : html`<slot name="status"></slot>`;
    return html`
      <div class="m-t-md row m-user-view">
        <div class="col-auto">${imgSlot}</div>
        <div class="col">
          <div>${nameSlot}<span class="m-l-md"> ${statusSlot}</span></div>
          <p>
            <time-field .createdAt=${this.createdAt} .modifiedAt=${this.modifiedAt}></time-field>
            <edit-bar-app ${ref(this.editBarAppEl)} class="m-l-md" uid=${this.uid}></edit-bar-app>
          </p>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    CHECK(this.eid);
    CHECK(this.entityType);
    this.hookUpEditBarEvents();
  }

  private hookUpEditBarEvents() {
    if (!appPageState.user) {
      return;
    }
    const editBarElement = this.editBarAppEl?.value;
    CHECK(editBarElement);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    editBarElement.addEventListener('deleteClick', async () => {
      if (
        await appAlert.confirm(
          ls.warning,
          formatLS(ls.pDoYouWantToDeleteThis, entityTypeToLS(this.entityType)),
        )
      ) {
        appAlert.showLoadingOverlay(ls.working);
        const loader = new DeleteEntityLoader(this.eid, this.entityType);
        const status = await appTask.critical(loader, ls.working);
        if (status.data) {
          // Redirect to profile page since this page has been deleted.
          pageUtils.setURL(status.data);
        }
      }
    });

    editBarElement.addEventListener('editClick', () => {
      if (!editPostApp) {
        editPostApp = renderTemplateResult(
          '',
          html`<set-entity-app
            autoClose
            .postID=${this.eid}
            entityType=${this.entityType}
            headerText=${formatLS(
              ls.pEditEntity,
              entityTypeToLS(this.entityType),
            )}></set-entity-app>`,
        );
      }
      CHECK(editPostApp);
      editPostApp.open = true;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-user-app': PostUserApp;
  }
}
