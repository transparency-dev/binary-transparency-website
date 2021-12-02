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
'use strict';

import LottiePlayer from '@lottiefiles/lottie-player'; // eslint-disable-line no-unused-vars

import FocusHandler from './core/focus-handler';
import ResizeWatcher from './core/resize-watcher';
import ScrollWatcher from './core/scroll-watcher.js';
import WebFonts from './core/web-fonts.js';
import Analytics from './core/analytics';
import Header from './core/header';
import CookieNotice from './core/cookie-notice.js';
import BrowserDetect from './core/browser-detect';
import Menu from './core/menu';
import PageScroller from './core/page-scroller';

import BannerVideo from './shared/banner-video';
import Slider from './shared/slider';

class Main {

  constructor() {
    document.documentElement.classList.remove('no-js'); // If we got this far then there certainly is JS!

    // Core
    new BrowserDetect();
    new Analytics('G-FC91ERVTG9');
    new CookieNotice();
    new FocusHandler();
    new Header();
    new Menu();
    new PageScroller();
    new ResizeWatcher();
    new ScrollWatcher();
    new WebFonts();

    this.init();
  }

  init() {
    this.initSliders();
    this.initBannerVideo();
    this.initLogoAnimation();
  }

  initSliders() {
    for (const el of document.querySelectorAll(`[data-slider]`)) {
      new Slider(el);
    }
  }

  initBannerVideo() {
    new BannerVideo();
  }

  initLogoAnimation() {
    // resolve display issue with lottieplayer in some browsers.
    const player = document.querySelector('lottie-player');
    if (player) {
      const shadow = player.shadowRoot;

      if (shadow) {

        const newStyle = document.createElement('style');
        newStyle.textContent = `svg { transform: none !important; }`;

        shadow.appendChild(newStyle);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new Main());
