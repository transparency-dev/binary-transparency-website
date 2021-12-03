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
/* globals window, CustomEvent */

import { debounce } from 'lodash';

'use strict';

export default class PageScroller {

  constructor() {
    this._headerLockTimer = null;
    this._headerLockDelay = 1000;
    this._menuLinkEls = document.querySelectorAll('.menu-link') || [];
    this._sectionEls = document.querySelectorAll('[data-section]') || [];
    this._scrollToTopEls = document.querySelectorAll('[data-scroll-to-top]') || [];
    this.triggerPageview = debounce((sectionId) => this.debouncedTriggerPageview(sectionId), 1500);
    this.bind();
  }

  bind() {

    // Bind scroll to top buttons
    this._scrollToTopEls.forEach(el => {
      el.addEventListener('click', (evt) => {
        if (window.location.pathname === '/') {
          evt.preventDefault();
          this.resetHeaderTimer();
          this.scrollToTop();
        }
      }, false);
    });

    // Hold header hide when scrolling due to menu click
    this._menuLinkEls.forEach(el => {
      el.addEventListener('click', (evt) => this.resetHeaderTimer(), false);
    });

    // Trigger tracking when top of section hits center of users screen
    let currSection = null;
    document.addEventListener('scroll-watcher', (evt) => {
      if (evt.detail && evt.detail.y !== undefined) {
        const scrollPos = evt.detail.y;
        if (scrollPos) {
          const scrollTriggerPos = scrollPos + (window.innerHeight / 2);
          this._sectionEls.forEach(el => {
            const id = el.dataset.section;
            if (id !== currSection) {
              const elPos = this.getElPos(el);
              if (
                scrollTriggerPos > elPos.top &&
                elPos.bottom > scrollTriggerPos
              ) {
                this.triggerPageview(id);
                currSection = id;
              }
            }
          });
        }
      }
    });
  }

  scrollToTop() {
    window.history.replaceState('', document.title, '/');
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  resetHeaderTimer() {
    window.clearTimeout(this._headerTimer); // Clear any current timers
    document.body.classList.add('lock-header-active'); // Prevent header hiding
    this._headerTimer = window.setTimeout(() => document.body.classList.remove('lock-header-active'), this._headerLockDelay); // Allow header hiding
  }

  getElPos(el) {
    const clientRect = el.getBoundingClientRect();
    const body = document.body;
    const doc = document.documentElement;
    const scrollTop = window.pageYOffset || body.scrollTop || doc.scrollTop;
    const clientTop = doc.clientTop || body.clientTop || 0;
    const top = clientRect.top + scrollTop - clientTop;
    return {
      top: Math.round(top),
      bottom: Math.round(top + clientRect.height),
    };
  }

  debouncedTriggerPageview(sectionId) {
    if (sectionId) {
      document.dispatchEvent(new CustomEvent('analytics-track-pageview', { detail: { path: `/#${ sectionId }` }}));
    }
  }

}
