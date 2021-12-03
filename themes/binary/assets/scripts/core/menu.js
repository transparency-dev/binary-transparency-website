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
/* global document */

'use strict';

export default class Menu {

  constructor(elem) {
    this._menu = elem || null;
    this._ident = 'data-menu';
    this.identTarget = 'data-menu-toggle';
    this._timeouts = [];
    this._menuTarget = null;

    if (this._menu === null) {
      this._menu = document.querySelector(`[${this._ident}]`);
    }

    if (this._menu) {
      this._menuTarget = this.getTarget(this._menu);
    }

    this.bind();
  }

  bind() {

    // Open/close mobile menu
    this._menuTarget.addEventListener('click', e => {
      if (!this._menuTarget.classList.contains('is-active')) {
        this.openMenu(this._menu);
      } else {
        this.closeMenu(this._menu);
      }
    }, false);

    // Close menu on scroll because the header will animate out
    document.addEventListener('scroll-watcher', (evt) => {
      if (
        evt.detail.direction.y === 'down' &&
        !this.headerIsLocked()
      ) {
        this.closeMenu(this._menu);
      }
    });


    document.addEventListener('resize-watcher', e => {
      if (e.detail.width > 991 ) {
        this._menuTarget.setAttribute('aria-hidden', true);
        this._menuTarget.setAttribute('disabled', 'disabled');
      } else {
        this._menuTarget.setAttribute('aria-hidden', false);
        this._menuTarget.removeAttribute('disabled');
      }

    });
  }

  getTarget(item) {
    return document.querySelector(`[${this.identTarget}=${item.id}]`);
  }

  openMenu(menu = null) {
    if (menu) {
      const target = this.getTarget(menu);

      menu.classList.add('menu-open');
      target.classList.add('is-active');
      target.setAttribute('aria-expanded', 'true');
    }
  }

  closeMenu(menu = null) {
    if (menu) {
      const target = this.getTarget(menu);

      menu.classList.remove('menu-open');
      target.classList.remove('is-active');
      target.setAttribute('aria-expanded', 'false');
    }
  }

  headerIsLocked() {
    return document.body.classList.contains('lock-header-active');
  }
}
