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
/* global window, CustomEvent */

'use strict';

export default class Analytics {

  constructor(gaId) {
    this.gaId = gaId || window.gaId;
    this.init();
  }

  init() {
    if (this.gaId) {
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${ this.gaId }`;
      document.body.appendChild(script1);

      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.textContent = `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date()); gtag('config', '${ this.gaId }');`;
      document.body.appendChild(script2);

      this.bindEvents();

      // Trigger initial page view
      document.dispatchEvent(new CustomEvent('analytics-track-pageview', {}));
    }
  }

  bindEvents() {

    // JS pageview event
    document.addEventListener('analytics-track-pageview', (e) => {
      const path = e.detail && e.detail.path || window.location.pathname;
      this.trackPage(path);
    });

    // JS event event
    document.addEventListener('analytics-track-event', (e) => {
      if (e.detail && e.detail.category && e.detail.action) {
        this.trackEvent(e.detail.category, e.detail.action, e.detail.label);
      }
    });

    // DOM event event
    document.querySelectorAll('[data-analytics-track-event]').forEach(el => {
      el.addEventListener('click', () => {
        const category = el.dataset.analyticsTrackEventCategory || null;
        const action = el.dataset.analyticsTrackEventAction || null;
        const label = el.dataset.analyticsTrackEventLabel || null;
        if (category && action) {
          this.trackEvent(category, action, label);
        }
      });
    });

    // DOM external link event
    document.querySelectorAll('[data-external-link]').forEach(el => {
      el.addEventListener('click', () => {
        const category = 'external';
        const action = 'click';
        const label = el.href;
        this.trackEvent(category, action, label);
      });
    });
  }

  trackPage(path) {
    if (this.gaId && window.gtag) {
      window.gtag('config', this.gaId, {page_path: path});
    }
  }

  trackEvent(category, action, label) {
    if (this.gaId && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  }
}
