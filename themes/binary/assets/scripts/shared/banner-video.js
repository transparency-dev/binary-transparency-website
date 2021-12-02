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
/* globals window */

'use strict';

export default class BannerVideo {

  constructor(elem = null) {
    this._element = elem || null;
    this._ident = 'data-banner-video';

    this._element = document.querySelector(`[${this._ident}]`);

    if (this._element) {
      this.bind();
    }
  }

  bind() {

    this._element.addEventListener('click', (e) => {
      const frame = document.createElement('iframe');

      frame.width = '100%';
      frame.height = '100%';
      frame.frameborder = 'none';
      frame.src = 'https://www.youtube.com/embed/' + this._element.getAttribute(this._ident) + '?&autoplay=1&rel=0';
      frame.title = '';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.allowfullscreen = 'allowfullscreen';

      this._element.parentNode.prepend(frame);

      window.setTimeout(() => {
        this._element.classList.add('fade-out');
      }, 500);

      window.setTimeout(() => {
        this._element.remove();
      }, 1000);
    });
  }

  getHtml(str) {
    const frame = document.createElement('iframe');

    frame.style.display = 'none';
    document.body.appendChild(frame);
    frame.contentDocument.open();
    frame.contentDocument.write(str);
    frame.contentDocument.close();

    const elem = frame.contentDocument.body.innerHTML;

    document.body.removeChild(frame);
    return elem;
  }
}
