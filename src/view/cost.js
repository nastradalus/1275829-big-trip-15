import AbstractView from './abstract';

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

export default class Cost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createCostTemplate(this._points);
  }
}
