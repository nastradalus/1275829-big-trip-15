import {createElement} from '../utils';

const createNoPointTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class NoPoint {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createNoPointTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
