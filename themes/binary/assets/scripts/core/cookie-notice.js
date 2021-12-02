/*
  Copyright 2021 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* globals window setTimeout */

'use strict';

import {LocalStorage} from '../core/utils';

export default class CookieNotice {

  constructor() {
    this.triggerName = 'cookie-notice';
    this.el = document.querySelector(`[data-cookie-message]`) || null;
    this.acceptEl = document.querySelector(`[data-cookie-accept]`) || null;
    this.closeEl = document.querySelector(`[data-cookie-close]`) || null;

    if (this.el && this.acceptEl) {
      this.bindEvents();
      this.init();
    }
  }

  bindEvents() {
    this.acceptEl.addEventListener('click', (e) => {
      this.accept();
    });
    this.closeEl.addEventListener('click', (e) => {
      this.goToPrivacy();
    });
  }

  init() {
    if (!new LocalStorage().getStorage(this.triggerName)) {
      this.show();
    } else {
      setTimeout((e) => {
        this.el.remove();
      }, 2000);
    }
  }

  accept() {
    new LocalStorage().setStorage(this.triggerName, 1);
    this.hide();
  }

  show() {
    this.el.classList.add('is-active');
    this.el.setAttribute('aria-hidden', false);
  }

  hide() {
    this.el.classList.remove('is-active');
    this.el.setAttribute('aria-hidden', true);

    setTimeout((e) => {
      this.el.remove();
    }, 2000);
  }

  goToPrivacy() {
    window.location.href = '/privacy-policy';
  }
}
