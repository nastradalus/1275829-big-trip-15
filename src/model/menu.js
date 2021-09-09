import AbstractObserver from '../utils/abstract-observer.js';
import {MenuItem} from '../const';

export default class Menu extends AbstractObserver {
  constructor() {
    super();
    this._activeItem = MenuItem.TABLE;
  }

  setMenuItem(updateType, item) {
    this._activeItem = item;
    this._notify(updateType, item);
  }

  getMenuItem() {
    return this._activeItem;
  }
}
