/* eslint-disable class-methods-use-this */
export default class Popovers {
  constructor(parentEl, title = '', text = '') {
    this.parentEl = parentEl;
    this.title = title;
    this.text = text;
    this.elPopup = document.createElement('div');
  }

  get htmlElement() {
    return `
    <p class="title-popup">${this.title}</p>
    <p class="text-popup">${this.text}</p>
    `;
  }

  bindToDOM() {
    this.elPopup.id = 'popup';
    this.elPopup.className = 'popup hidden';
    this.elPopup.innerHTML = this.htmlElement;
    this.parentEl.appendChild(this.elPopup);
  }

  positionPopup(element) {
    const selectPopup = document.querySelector('#popup');
    selectPopup.classList.remove('hidden');
    selectPopup.style.bottom = `${element.offsetTop + 10}px`;
    selectPopup.style.left = `${element.offsetLeft
    - ((selectPopup.offsetWidth - element.offsetWidth) / 2)}px`;
  }
}
