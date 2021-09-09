import AbstractView from './abstract';
import {MenuItem} from '../const.js';

const activeItemClass = 'trip-tabs__btn--active';

const createMenuTemplate = (activeItem) => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn ${activeItem === MenuItem.TABLE ? activeItemClass : ''}" href="#" data-item="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn ${activeItem === MenuItem.STATS ? activeItemClass : ''}" href="#" data-item="${MenuItem.STATS}">Stats</a>
  </nav>`
);

export default class Menu extends AbstractView {
  constructor(activeItem) {
    super();

    this._activeItem = activeItem;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._activeItem);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.item);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelectorAll('.trip-tabs__btn')
      .forEach((menuItem) => menuItem.addEventListener('click', this._menuClickHandler));
  }
}
