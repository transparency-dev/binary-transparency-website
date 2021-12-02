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
/* globals setTimeout document clearTimeout */

'use strict';

import Hammer from 'hammerjs';

export default class Slider {

  constructor(elem) {
    this._slider = elem || null;
    this._ident = 'data-slider';
    this._identNext = 'data-slider-next';
    this._identPrev = 'data-slider-prev';
    this._identSlide = 'data-slider-slide';
    this._identTray = 'data-slider-tray';
    this._identIndicator = 'data-slider-indicator';
    this._identRestart = 'data-slider-restart';
    this._activeClass = 'is-active';
    this._tray = null;
    this._slides = null;
    this._indicatorButtons = null;
    this._currentSlide = 0;
    this._autoflipper = null;
    this._timeout = 5000;
    this._useAuto = true;

    if (this._slider) {
      this._slides = this._slider.querySelectorAll(`[${this._identSlide}]`) || null;
      this._tray = this._slider.querySelector(`[${this._identTray}]`) || null;
      this._indicatorButtons = this._slider.querySelectorAll(`[${this._identIndicator}]`) || null;
      this._slides[0].classList.add('is-active');

      this.setAutoflipper();
      this.setWidths();
      this.setupAria();
      this.updateIndicator();
      this.bind();
    }

  }

  setupAria() {
    this._slider.setAttribute('aria-roledescription', 'carousel');
    this._tray.setAttribute('aria-live', 'off');
    this._slides.forEach( (item, i) => {
      item.setAttribute('aria-roledescription', 'slide');
      item.setAttribute('aria-label', `Slide ${i + 1} of ${this._slides.length + 1}`);
      item.setAttribute('data-href', item.href);

      if (i === 0) {
        item.setAttribute('aria-hidden', 'false');
        item.style.pointerEvents = 'all';
        item.style.cursor = 'pointer';
      } else {
        item.setAttribute('aria-hidden', 'true');
        item.style.pointerEvents = 'none';
        item.style.cursor = 'default';
        item.removeAttribute('href');
      }
    });
  }

  setAutoflipper(setActive = false) {
    const restartButton = this._slider.querySelector(`[${this._identRestart}]`);

    if (setActive) {
      this._useAuto = true;
      restartButton.classList.remove('is-active');
    }

    if (this._useAuto) {
      this._autoflipper = setTimeout(() => {
        this.nextSlide();
      }, this._timeout);
    }
  }

  unsetAutoflipper(interaction = null) {
    clearTimeout(this._autoflipper);

    const restartButton = this._slider.querySelector(`[${this._identRestart}]`);
    restartButton.classList.add('is-active');

    if (interaction) {
      this._useAuto = false;
    }
  }

  bind() {

    // Mouse
    const nextButton = this._slider.querySelector(`[${this._identNext}]`);
    const prevButton = this._slider.querySelector(`[${this._identPrev}]`);
    const restartButton = this._slider.querySelector(`[${this._identRestart}]`);

    nextButton.addEventListener('click', (e) => {
      this.unsetAutoflipper(true);
      this.haltButton(e.target);
      this.nextSlide();
    });

    prevButton.addEventListener('click', (e) => {
      this.unsetAutoflipper(true);
      this.haltButton(e.target);
      this.prevSlide();
    });

    restartButton.addEventListener('click', (e) => {

      if (e.target.classList.contains('is-active') || !this._useAuto) {
        this.setAutoflipper(true);
      } else {
        this.unsetAutoflipper(true);
      }

      this.haltButton(e.target);

    });

    document.addEventListener('resize-watcher', (e) => {
      this.setWidths(e.detail);
    });

    this._indicatorButtons.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        this.unsetAutoflipper(true);
        this.haltButton(e.target);
        this._currentSlide = indicator.dataset.sliderIndicator - 1;
        this.moveToSlide();
      });
    });

    this._slides.forEach(slide => {
      slide.addEventListener('click', (e) => {
        this.unsetAutoflipper(true);
      });
    });

    // Touch
    const hammertime = new Hammer(this._slider);
    hammertime.on('swipeleft', (evt) => {
      this.unsetAutoflipper(true);
      this.nextSlide();
    });
    hammertime.on('swiperight', (evt) => {
      this.unsetAutoflipper(true);
      this.prevSlide();
    });
  }

  haltButton(button) {
    button.style.pointerEvents = 'none';
    button.disabled = true;
    button.setAttribute('aria-disabled', true);

    setTimeout(() => {
      button.style.pointerEvents = 'all';
      button.disabled = false;
      button.setAttribute('aria-disabled', false);
    }, 250);
  }

  trayWidth() {
    return 100 * this._slides.length;
  }

  nextSlide() {
    clearTimeout(this._autoflipper);
    this._slides[this._currentSlide].classList.remove('is-active');
    this._slides[this._currentSlide].setAttribute('aria-hidden', 'true');

    this._slides[this._currentSlide].style.pointerEvents = 'none';
    this._slides[this._currentSlide].style.cursor = 'default';

    this._slides[this._currentSlide].removeAttribute('href');

    this._currentSlide = (this._currentSlide + 1) % this._slides.length;

    if (this._currentSlide > this._slides.length) {
      this._currentSlide = 0;
    }

    if (this._useAuto) {
      this.setAutoflipper();
    }

    this.moveToSlide();
  }

  prevSlide() {
    clearTimeout(this._autoflipper);
    this._slides[this._currentSlide].classList.remove('is-active');
    this._slides[this._currentSlide].setAttribute('aria-hidden', 'true');

    this._slides[this._currentSlide].style.pointerEvents = 'none';
    this._slides[this._currentSlide].style.cursor = 'default';

    this._slides[this._currentSlide].removeAttribute('href');

    this._currentSlide = (this._currentSlide - 1) % this._slides.length;

    if (this._currentSlide == -1) {
      this._currentSlide = this._slides.length - 1;
    }

    this.moveToSlide();
  }

  moveToSlide() {
    this._tray.style.transform = `translateX(-${100 / (this._slides.length + 1) * this._currentSlide}%)`;
    this._slides[this._currentSlide].classList.add('is-active');
    this._slides[this._currentSlide].setAttribute('aria-hidden', 'false');
    this._slides[this._currentSlide].style.pointerEvents = 'all';
    this._slides[this._currentSlide].style.cursor = 'pointer';

    this._slides[this._currentSlide].setAttribute('href', this._slides[this._currentSlide].getAttribute('data-href'));

    this.updateIndicator();
  }

  updateIndicator() {
    this._indicatorButtons.forEach(indicator => {
      if ((indicator.dataset.sliderIndicator - 1) === this._currentSlide) {
        indicator.classList.add('is-active');
      } else {
        indicator.classList.remove('is-active');
      }
    });
  }

  updateOnResize() {
    this.setTrayWidth();
  }

  setWidths(details) {
    const trayWindow = this._tray.parentNode;
    this._tray.style.width = `${trayWindow.offsetWidth * (this._slides.length + 1)}px`;
    for (const slide of this._slides) {
      slide.style.width = `${trayWindow.offsetWidth}px`;
    }
  }
}
