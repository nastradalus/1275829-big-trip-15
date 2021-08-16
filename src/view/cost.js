import {createElement} from '../utils';

const OBJECT_VALUE_INDEX = 1;

const createCostTemplate = (points = []) => {
  const price = points.reduce((previousValue, currentPoint, index) =>
    (index === OBJECT_VALUE_INDEX)
      ? previousValue.price + currentPoint.price
      : previousValue + currentPoint.price);

  return `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`;
};

export default class Cost {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  _getTemplate() {
    return createCostTemplate(this._points);
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
