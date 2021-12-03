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

export default class Header {

  constructor() {
    this._header = document.querySelector(`[data-header]`);
    this.minScrollTrigger = 150;
    this.scrollData = null;

    this.bind();
  }

  bind() {
    document.addEventListener('scroll-watcher', (evt) => {
      this.scrollData = evt.detail;
      if (evt.detail.direction.y === 'up') {
        this.onScrollUp(evt.detail);
      } else if (evt.detail.direction.y === 'down') {
        this.onScrollDown(evt.detail);
      }
    });
  }

  onScrollUp() {
    this.showHeader();
  }

  onScrollDown() {
    if (this.scrollData.top) {
      this.hideShadow();
    } else {
      this.showShadow();
    }
    if (
      this.scrollData.y >= this.minScrollTrigger &&
      !this.headerIsLocked()
    ) {
      this.hideHeader();
    }
  }

  showHeader() {
    this._header.classList.add('is-active');
    if (this.scrollData.top) {
      this.hideShadow();
    } else {
      this.showShadow();
    }
  }

  hideHeader() {
    this._header.classList.remove('is-active');
    this.hideShadow();
  }

  isHeaderVisible() {
    this._header.classList.contains('is-active');
  }

  showShadow() {
    this._header.classList.add('has-shadow');
  }

  hideShadow() {
    this._header.classList.remove('has-shadow');
  }

  headerIsLocked() {
    return document.body.classList.contains('lock-header-active');
  }
}
