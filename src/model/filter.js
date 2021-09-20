import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../const.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
    this._availability = true;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._availability = true;
    this._notify(updateType, filter);
  }

  changeAvailability(updateType, availability) {
    this._availability = availability;
    this._notify(updateType, availability);
  }

  getAvailability() {
    return this._availability;
  }

  getFilter() {
    return this._activeFilter;
  }
}
