import {createElement} from '../utils';

const createTripInfoTemplate = () => (
  '<section class="trip-main__trip-info trip-info"></section>'
);

export default class TripInfo {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createTripInfoTemplate();
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
