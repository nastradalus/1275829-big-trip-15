import AbstractView from './abstract';
import {OFFERS_BY_TYPE} from '../mock/offer';

const getOfferPrices = ({type, offers}) => {
  let offerPrice = 0;

  if (!offers.length) {
    return offerPrice;
  }

  OFFERS_BY_TYPE[type].forEach(({code, price}) => {
    if (offers.includes(code)) {
      offerPrice += price;
    }
  });

  return offerPrice;
};

const createCostTemplate = (points = []) => {
  let price = 0;

  points.forEach((point) => {
    price += point.price + getOfferPrices(point);
  });

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
