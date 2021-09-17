import AbstractView from './abstract';

const getOfferPrices = ({type, offers}, allOffers) => {
  let offerPrice = 0;

  if (!offers.length) {
    return offerPrice;
  }

  allOffers[type].forEach(({code, price}) => {
    if (offers.includes(code)) {
      offerPrice += price;
    }
  });

  return offerPrice;
};

const createCostTemplate = (points = [], allOffers) => {
  let price = 0;

  points.forEach((point) => {
    price += point.price + getOfferPrices(point, allOffers);
  });

  return `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`;
};

export default class Cost extends AbstractView {
  constructor(points, offers) {
    super();
    this._points = points;
    this._offers = offers;
  }

  getTemplate() {
    return createCostTemplate(this._points, this._offers);
  }
}
